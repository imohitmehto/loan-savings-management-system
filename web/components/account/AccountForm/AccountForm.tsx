"use client";
import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useMemo,
  useCallback,
} from "react";
import { AccountFormProps } from "@/types/AccountForm";
import { AccountFormSchema } from "@/validators/AccountFormSchema";
import { fetchAllAccounts } from "@/lib/api/accounts";
import { fetchAllAccountGroup } from "@/lib/api/accountGroups";
import {
  emptyAddress,
  emptyNominee,
  emptyForm,
} from "@/utils/constants/account";
import FileUploadField from "../../common/fields/FileUploadField";
import calculateAge from "@/utils/calculateAge";
import { AddressSection } from "./Sections/AddressSection";
import PersonalInfoSection from "./Sections/PersonalInfoSection";
import { NomineeSection } from "./Sections/NomineeSection";
import { NomineeRelationOptions } from "@/utils/enums/nominee-relation.enum";

export default function AccountForm({
  initialValues = {},
  onSubmit,
  loading = false,
  submitLabel = "Create Account",
  readOnly = false,
}: AccountFormProps) {
  /** ---------------- State ---------------- */
  const [form, setForm] = useState<typeof emptyForm>(() => ({
    ...emptyForm,
    ...initialValues,
    nominees: initialValues.nominees || [],
    addresses: {
      ...emptyForm.addresses,
      ...initialValues.addresses,
    },
    isChildAccount: initialValues.isChildAccount || false,
    parentAccountId: initialValues.parentAccountId || "",
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [parentAccountOptions, setParentAccountOptions] = useState<
    { value: string; label: string }[]
  >([]);

  /** ---------------- Derived Values ---------------- */
  const age = useMemo(() => calculateAge(form.dob), [form.dob]);
  const isChildAccount = age !== null && age < 18;

  /** ---------------- Effects ---------------- */
  // Load groups (for quick caching - still lazy in UI)
  useEffect(() => {
    fetchAllAccountGroup()
      .then((groupsData) => {
        const groupsArray = Array.isArray(groupsData)
          ? groupsData
          : groupsData?.items || [];

        // ✅ Store as { value, label }
        const options = groupsArray.map((g) => ({
          value: g.id,
          label: g.name || "Unnamed Group",
        }));

        setGroupOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch groups", error);
        setGroupOptions([]);
      });
  }, []);

  // Load parent accounts (adult only) for caching
  useEffect(() => {
    fetchAllAccounts()
      .then((accountsData) => {
        setParentAccountOptions(
          Array.isArray(accountsData)
            ? accountsData
                .filter((acc) => calculateAge(acc.dob) ?? 0 >= 18)
                .map((acc) => ({
                  value: acc.id,
                  label: `${acc.firstName} ${acc.lastName} (${acc.accountNumber})`,
                }))
            : [],
        );
      })
      .catch((error) => {
        console.error("Failed to fetch parent accounts", error);
        setParentAccountOptions([]);
      });
  }, []);

  // Sync image preview on prop change
  useEffect(() => {
    if (initialValues.imagePreviewUrl) {
      setForm((f) => ({
        ...f,
        imagePreviewUrl: initialValues.imagePreviewUrl,
      }));
    }
  }, [initialValues.imagePreviewUrl]);

  // Sync child/parent account logic
  useEffect(() => {
    if (form.isChildAccount !== isChildAccount) {
      setForm((prev) => ({
        ...prev,
        isChildAccount,
        parentAccountId: isChildAccount ? prev.parentAccountId : "",
      }));
    }
  }, [isChildAccount, form.isChildAccount]);

  /** ---------------- Lazy Search Handlers ---------------- */
  const onSearchGroups = useCallback(
    async (search: string, page: number) => {
      const pageSize = 10;

      // ✅ Filter by label (safe)
      const filtered = groupOptions.filter((g) =>
        g.label.toLowerCase().includes(search.toLowerCase()),
      );

      const start = (page - 1) * pageSize;
      return {
        options: filtered.slice(start, start + pageSize),
        hasMore: filtered.length > start + pageSize,
      };
    },
    [groupOptions],
  );

  const onSearchParentAccounts = useCallback(
    async (search: string, page: number) => {
      const all = await fetchAllAccounts();
      const filtered = all
        .filter((acc) => (calculateAge(acc.dob) ?? 0) >= 18)
        .filter((acc) =>
          `${acc.firstName} ${acc.lastName} ${acc.accountNumber}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        );

      const pageSize = 10;
      const start = (page - 1) * pageSize;
      return {
        options: filtered.slice(start, start + pageSize).map((acc) => ({
          value: acc.id,
          label: `${acc.firstName} ${acc.lastName} (${acc.accountNumber})`,
        })),
        hasMore: filtered.length > start + pageSize,
      };
    },
    [],
  );

  /** ---------------- Handlers ---------------- */
  const setNestedField = useCallback((path: string, value: unknown) => {
    setForm((f) => {
      const updated = structuredClone(f);
      const keys = path.split(".");
      let obj: unknown = updated;
      keys.slice(0, -1).forEach((k) => {
        if (typeof obj[k] !== "object" || obj[k] === null) obj[k] = {};
        obj = obj[k];
      });
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
      const { name, value, type } = e.target;

      if (type === "file") {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          const fileUrl = URL.createObjectURL(file);
          setForm((prev) => {
            const updated = { ...prev };
            if (name === "imageFile") {
              updated.imageFile = file;
              updated.imagePreviewUrl = fileUrl;
            } else if (name === "panCardFile") {
              updated.panCardFile = file;
              updated.panCardPreview = fileUrl;
            } else if (name === "aadhaarCardFile") {
              updated.aadhaarCardFile = file;
              updated.aadhaarCardPreview = fileUrl;
            }
            return updated;
          });
        }
        return;
      }

      if (name.includes(".")) {
        setNestedField(name, value);
      } else {
        setForm((prev) => ({ ...prev, [name]: value }));
      }

      setErrors((prev) => {
        if (!(name in prev)) return prev;
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    },
    [setNestedField],
  );

  const addNominee = useCallback(
    () =>
      setForm((f) => ({
        ...f,
        nominees: [...f.nominees, { ...emptyNominee }],
      })),
    [],
  );

  const removeNominee = useCallback(
    (index: number) =>
      setForm((f) => {
        const nominees = f.nominees.filter((_, i) => i !== index);
        return { ...f, nominees };
      }),
    [],
  );

  const toggleSameAsUserAddress = useCallback(
    (index: number) =>
      setForm((f) => {
        const nominees = [...f.nominees];
        const nominee = { ...nominees[index] };
        nominee.sameAsUserAddress = !nominee.sameAsUserAddress;
        nominee.address = nominee.sameAsUserAddress
          ? { ...f.addresses.current, type: "NOMINEE" }
          : { ...emptyAddress, type: "NOMINEE" };
        nominees[index] = nominee;
        return { ...f, nominees };
      }),
    [],
  );

  const toggleSameAsCurrentAddress = useCallback(
    () =>
      setForm((f) => {
        const same = !f.addresses.sameAsUserAddress;
        return {
          ...f,
          addresses: {
            ...f.addresses,
            sameAsUserAddress: same,
            permanent: same
              ? { ...f.addresses.current, type: "PERMANENT" }
              : { ...emptyAddress, type: "PERMANENT" },
          },
        };
      }),
    [],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // --- Transform state to backend shape ---
      const transformedForm = {
        ...form,
        addresses: [
          { ...form.addresses.current, type: "CURRENT" },
          { ...form.addresses.permanent, type: "PERMANENT" },
        ],
        nominees:
          form.nominees?.length > 0
            ? form.nominees.map((n) => {
                const _n = { ...n };
                if (!_n.email) delete _n.email;
                if (!_n.phoneNumber) delete _n.phoneNumber;
                return _n;
              })
            : undefined,
      };

      // --- Validate with zod ---
      const result = AccountFormSchema.safeParse(transformedForm);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          fieldErrors[err.path.join(".")] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      // --- Build FormData from *validated* object ---
      const formData = new FormData();

      // Required Strings
      formData.append("firstName", transformedForm.firstName.trim());
      formData.append("lastName", transformedForm.lastName.trim());
      formData.append("fatherSpouse", transformedForm.fatherSpouse.trim());

      // Enums (force uppercase to match backend)
      formData.append("occupation", transformedForm.occupation.toUpperCase());
      formData.append("gender", transformedForm.gender.toUpperCase());
      formData.append("type", transformedForm.type.toUpperCase());

      if (transformedForm.status) {
        formData.append("status", transformedForm.status.toUpperCase());
      }

      // Other Strings
      if (transformedForm.email)
        formData.append("email", transformedForm.email);
      if (transformedForm.phone)
        formData.append("phone", transformedForm.phone);

      // Date → safer "YYYY-MM-DD"
      if (transformedForm.dob) {
        const dobStr = new Date(transformedForm.dob).toISOString();
        formData.append("dob", dobStr);
      }

      // Booleans
      formData.append(
        "isChildAccount",
        transformedForm.isChildAccount ? "true" : "false",
      );
      if (transformedForm.parentAccountId) {
        formData.append("parentAccountId", transformedForm.parentAccountId);
      }

      // Numbers
      if (typeof transformedForm.accountOpeningFee === "number") {
        formData.append(
          "accountOpeningFee",
          transformedForm.accountOpeningFee.toString(),
        );
      }

      // Addresses
      transformedForm.addresses.forEach((addr, idx) => {
        Object.entries(addr).forEach(([key, value]) => {
          if (value !== undefined && value !== null)
            formData.append(`addresses[${idx}].${key}`, value);
        });
      });

      // Nominees
      if (transformedForm.nominees) {
        transformedForm.nominees.forEach((nominee, idx) => {
          Object.entries(nominee).forEach(([key, value]) => {
            if (
              typeof value === "object" &&
              value !== null &&
              !Array.isArray(value)
            ) {
              // Nested address inside nominee
              Object.entries(value).forEach(([addrKey, addrVal]) => {
                if (addrVal !== undefined && addrVal !== null)
                  formData.append(
                    `nominees[${idx}].${key}.${addrKey}`,
                    addrVal,
                  );
              });
            } else if (value !== undefined && value !== null) {
              formData.append(`nominees[${idx}].${key}`, value);
            }
          });
        });
      }

      // Group ID
      if (transformedForm.groupId) {
        formData.append("groupId", transformedForm.groupId);
      }

      if (transformedForm.imageFile)
        formData.append("photo", transformedForm.imageFile);
      if (transformedForm.panCardFile)
        formData.append("panCard", transformedForm.panCardFile);
      if (transformedForm.aadhaarCardFile)
        formData.append("aadhaarCard", transformedForm.aadhaarCardFile);

      try {
        await onSubmit(formData);
      } catch (err) {
        console.error("Form submission failed", err);
      }
    },
    [form, onSubmit],
  );

  /** ---------------- Render ---------------- */
  return (
    <form
      className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow space-y-8"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Profile Image Upload */}
      <FileUploadField
        label="Profile Image"
        name="imageFile"
        file={form.imageFile}
        filePreview={form.imagePreviewUrl}
        accept="image/*"
        onChange={handleChange}
        isCircular
        disabled={readOnly}
      />

      {/* Personal Info */}
      <PersonalInfoSection
        form={form}
        errors={errors}
        onChange={handleChange}
        groupOptions={groupOptions}
        parentAccountOptions={parentAccountOptions}
        disabled={readOnly}
        onSearchGroups={onSearchGroups}
        onSearchParentAccounts={onSearchParentAccounts}
      />

      {/* Addresses */}
      <AddressSection
        addresses={form.addresses}
        errors={errors}
        onChange={handleChange}
        toggleSameAsCurrentAddress={toggleSameAsCurrentAddress}
        disabled={readOnly}
      />

      {/* Documents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileUploadField
          label="PAN Card"
          name="panCardFile"
          file={form.panCardFile}
          filePreview={form.panCardPreview}
          accept="image/*,application/pdf"
          onChange={handleChange}
          disabled={readOnly}
        />
        <FileUploadField
          label="Aadhaar Card"
          name="aadhaarCardFile"
          file={form.aadhaarCardFile}
          filePreview={form.aadhaarCardPreview}
          accept="image/*,application/pdf"
          onChange={handleChange}
          disabled={readOnly}
        />
      </div>

      {/* Nominees */}
      <NomineeSection
        nominees={form.nominees}
        errors={errors}
        onChange={handleChange}
        nomineeRelations={NomineeRelationOptions.map((r) => r.value).filter(
          Boolean,
        )}
        addNominee={addNominee}
        removeNominee={removeNominee}
        toggleSameAsUserAddress={toggleSameAsUserAddress}
        disabled={readOnly}
      />

      {/* Submit Button */}
      {!readOnly && (
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : submitLabel}
        </button>
      )}
    </form>
  );
}
