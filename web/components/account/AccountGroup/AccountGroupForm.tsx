"use client";
import React, { useEffect, useState, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Account } from "@/types/Account";
import { fetchAllAccounts } from "@/lib/api/accounts";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import LazySearchSelect, {
  OptionType,
} from "@/components/common/LazySearchSelect";
import TextField from "@/components/common/fields/TextField";

export interface AccountGroupFormValues {
  id?: string;
  name?: string;
  description?: string;
  accounts?: string[];
  groupName?: string;
}

export interface AccountGroupFormProps {
  initialValues?: AccountGroupFormValues;
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
  showCancelButton?: boolean;
  readOnly?: boolean;
}

export default function AccountGroupForm({
  initialValues = {},
  onSubmit,
  loading = false,
  submitLabel = "Create Group",
  showCancelButton = true,
  readOnly = false,
}: AccountGroupFormProps) {
  const router = useRouter();

  /** Form State */
  const [form, setForm] = useState({
    name: initialValues.name || "",
    description: initialValues.description || "",
    groupName: initialValues.groupName || "",
  });
  const [selectedAccounts, setSelectedAccounts] = useState<OptionType[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(false);

  /** Fetch preselected accounts */
  useEffect(() => {
    if (initialValues.accounts?.length) {
      (async () => {
        setLoadingAccounts(true);
        try {
          const allAccounts = await fetchAllAccounts();
          const preselected = allAccounts
            .filter((acc: Account) => initialValues.accounts!.includes(acc.id))
            .map(toOptionType);
          setSelectedAccounts(preselected);
        } finally {
          setLoadingAccounts(false);
        }
      })();
    }
  }, [initialValues.accounts]);

  /** Field Validations */
  const validateFields = useCallback(() => {
    const validationErrors: Record<string, string> = {};
    if (!form.name.trim()) validationErrors["name"] = "Group Name is required";
    if (!form.groupName)
      validationErrors["groupName"] = "Please select a group";
    return validationErrors;
  }, [form]);

  /** Lazy Account Loader with search + pagination */
  const lazyLoadAccounts = useCallback(
    async (search: string, page: number) => {
      const all = await fetchAllAccounts();

      const filtered = all.filter((acc) => {
        if (selectedAccounts.some((o) => o.value === acc.id)) return false;
        const term = search.toLowerCase();
        return !term || toSearchString(acc).includes(term);
      });

      const pageSize = 10;
      const start = (page - 1) * pageSize;
      const paginated = filtered.slice(start, start + pageSize);

      return {
        options: paginated.map(toOptionType),
        hasMore: start + pageSize < filtered.length,
      };
    },
    [selectedAccounts]
  );

  /** Handlers */
  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));

    // Remove error as user edits
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateFields();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());

    selectedAccounts.forEach((acc) => formData.append("accountIds", acc.value));

    onSubmit(formData);
  };

  const handleCancel = () => router.back();

  /** Loading state */
  if ((loading || loadingAccounts) && !selectedAccounts.length) {
    return <LoadingSpinner />;
  }

  return (
    <form
      className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow space-y-8"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Name */}
      <TextField
        label="Name"
        id="name"
        value={form.name}
        onChange={onChange}
        required
        error={errors["name"]}
        autoComplete="given-name"
        disabled={readOnly}
      />

      {/* Description */}
      <TextField
        label="Description"
        id="description"
        value={form.description}
        onChange={onChange}
        multiline
        rows={3}
        disabled={readOnly}
      />

      {/* Accounts Multi-Select */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Add Accounts to Group
        </label>
        <LazySearchSelect
          selected={selectedAccounts}
          onSelect={(option) =>
            setSelectedAccounts((prev) =>
              prev.some((o) => o.value === option.value)
                ? prev
                : [...prev, option]
            )
          }
          onRemove={(option) =>
            setSelectedAccounts((prev) =>
              prev.filter((o) => o.value !== option.value)
            )
          }
          onSearch={lazyLoadAccounts}
          placeholder="Search and add accounts..."
          disabled={readOnly}
        />
        {selectedAccounts.length > 0 && (
          <SelectedItemsPreview
            items={selectedAccounts}
            onRemove={(val) =>
              setSelectedAccounts((prev) => prev.filter((o) => o.value !== val))
            }
            disabled={readOnly}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        {showCancelButton && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        {!readOnly && (
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : submitLabel}
          </button>
        )}
      </div>
    </form>
  );
}

/** Helper Components */
function SelectedItemsPreview({
  items,
  onRemove,
  disabled,
}: {
  items: OptionType[];
  onRemove: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap mt-2 gap-2">
      {items.map((item) => (
        <span
          key={item.value}
          className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
        >
          {item.label}
          {!disabled && (
            <button
              type="button"
              className="ml-1 text-lg text-blue-400 hover:text-red-500 focus:outline-none"
              onClick={() => onRemove(item.value)}
              aria-label={`Remove ${item.label}`}
            >
              ×
            </button>
          )}
        </span>
      ))}
    </div>
  );
}

/** Utilities */
function toOptionType(acc: Account): OptionType {
  return {
    value: acc.id,
    label: `${acc.firstName} ${acc.lastName} (${acc.accountNumber})`,
    meta: acc,
  };
}

function toSearchString(acc: Account) {
  return `${acc.firstName ?? ""} ${acc.lastName ?? ""} ${acc.accountNumber ?? ""} ${acc.email ?? ""}`.toLowerCase();
}
