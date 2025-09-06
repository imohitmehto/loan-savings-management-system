"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
  useMemo,
} from "react";
import { AccountFormProps } from "@/types/AccountForm";
import { AccountFormSchema } from "@/validators/AccountFormSchema";
import { fetchAllAccounts } from "@/lib/api/accounts";
import { fetchAllAccountGroup } from "@/lib/api/accountGroups";
import {
  emptyAddress,
  emptyNominee,
  emptyForm,
} from "@/utils/empty_form/account";
import calculateAge from "@/utils/calculateAge.util";
import ImageUploadField from "@/components/common/fields/ImageUploadField";
import PersonalInfoSection from "./Sections/PersonalInfoSection";
import { AddressSection } from "./Sections/AddressSection";
import { NomineeSection } from "./Sections/NomineeSection";
import { NomineeRelationOptions } from "@/utils/enums/nominee-relation.enum";

type SelectOption = { value: string; label: string };

export default function AccountForm({
  initialValues = {},
  onSubmit,
  loading = false,
  submitLabel = "Create Account",
  readOnly = false,
}: AccountFormProps) {
  // — State —
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [groupOptions, setGroupOptions] = useState<SelectOption[]>([]);
  const [parentOptions, setParentOptions] = useState<SelectOption[]>([]);

  // — Derived —
  const age = useMemo(() => calculateAge(form.dob), [form.dob]);
  const isChildAccount = age !== null && age < 18;

  // — Fetch Groups & Parents —
  useEffect(() => {
    fetchAllAccountGroup()
      .then((data) => {
        const groups = Array.isArray(data) ? data : data.items;
        setGroupOptions(
          groups.map((g) => ({ value: g.id, label: g.name || "Unnamed" }))
        );
      })
      .catch(() => setGroupOptions([]));

    fetchAllAccounts()
      .then((data) => {
        const adults = (Array.isArray(data) ? data : [])
          .filter((a) => (calculateAge(a.dob) ?? 0) >= 18)
          .map((a) => ({
            value: a.id,
            label: `${a.firstName} ${a.lastName} (${a.accountNumber})`,
          }));
        setParentOptions(adults);
      })
      .catch(() => setParentOptions([]));
  }, []);

  // — Helper to set nested fields via dotted paths —
  const setNestedField = useCallback((path: string, value: any) => {
    setForm((prev) => {
      const updated = structuredClone(prev);
      const keys = path.split(".");
      let obj: any = updated;
      keys.slice(0, -1).forEach((k) => {
        if (obj[k] == null || typeof obj[k] !== "object") obj[k] = {};
        obj = obj[k];
      });
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  }, []);

  // — Field Change Handler —
  const handleFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
      const { name, type, files, value } = e.target as any;
      if (type === "file") {
        const file = files?.[0] ?? null;
        setNestedField(name, file);
        setNestedField(
          `${name}PreviewUrl`,
          file ? URL.createObjectURL(file) : ""
        );
      } else if (name.includes(".")) {
        setNestedField(name, value);
      } else {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    },
    [setNestedField]
  );

  // — Toggle “Same as Current” for Permanent Address —
  const toggleSameAsCurrentAddress = useCallback(() => {
    setForm((prev) => {
      const same = !prev.addresses.sameAsUserAddress;
      const current = prev.addresses.current;
      return {
        ...prev,
        addresses: {
          ...prev.addresses,
          sameAsUserAddress: same,
          permanent: same
            ? { ...current, type: "PERMANENT" }
            : { ...emptyAddress, type: "PERMANENT" },
        },
      };
    });
  }, []);

  const toggleNomineeAddress = useCallback((index: number) => {
    setForm((prev) => {
      const nominees = [...prev.nominees];
      const n = { ...nominees[index] };
      n.sameAsUserAddress = !n.sameAsUserAddress;
      n.address = n.sameAsUserAddress
        ? { ...prev.addresses.current, type: "NOMINEE" }
        : { ...emptyAddress, type: "NOMINEE" };
      nominees[index] = n;
      return { ...prev, nominees };
    });
  }, []);

  // — Scroll to First Error —
  const scrollToError = useCallback((fieldErrors: Record<string, string>) => {
    const first = Object.keys(fieldErrors)[0];
    if (!first) return;
    const el = document.querySelector(`[name="${first}"], #${first}`);
    (el as HTMLElement)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  // — Submit —
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Prepare payload according to backend CreateAccountDto expectations
      const payload = {
        ...form,
        // Convert addresses from grouped to array with type discriminator
        addresses: [
          { ...form.addresses.current, type: "CURRENT" },
          { ...form.addresses.permanent, type: "PERMANENT" },
        ],
        // Add 'type' to nominee addresses and clean undefined optional fields
        nominees:
          form.nominees?.map((n) => ({
            ...n,
            email: n.email || undefined,
            phoneNumber: n.phoneNumber || undefined,
            address: { ...n.address, type: "NOMINEE" },
          })) ?? [],
      };

      const validation = AccountFormSchema.safeParse(payload);
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          fieldErrors[err.path.join(".")] = err.message;
        });
        setErrors(fieldErrors);
        scrollToError(fieldErrors);
        return;
      }

      // Convert to FormData for file uploads compatibility
      const formData = new FormData();
      Object.entries(payload).forEach(([key, val]) => {
        if (val == null) return;
        if (key === "addresses" || key === "nominees") {
          formData.append(key, JSON.stringify(val));
        } else if (val instanceof File) {
          formData.append(key, val);
        } else {
          formData.append(key, String(val));
        }
      });

      await onSubmit(formData).catch(console.error);
    },
    [form, onSubmit, scrollToError]
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow space-y-8"
    >
      {/* Profile Image */}
      <div className="flex justify-center">
        <ImageUploadField
          label="Profile Image"
          name="photo" /* Changed from image to photo for backend matching */
          placeholder="Upload Profile"
          file={form.photo}
          filePreview={form.photoPreviewUrl}
          onChange={handleFieldChange}
          isCircular
          disabled={readOnly}
          maxSizeInMB={3}
          acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
        />
      </div>

      {/* Personal Info */}
      <PersonalInfoSection
        form={form}
        errors={errors}
        onChange={handleFieldChange}
        groupOptions={groupOptions}
        parentOptions={parentOptions}
        isChildAccount={isChildAccount}
        readOnly={readOnly}
      />

      {/* Addresses */}
      <AddressSection
        addresses={form.addresses}
        errors={errors}
        onChange={handleFieldChange}
        toggleSameAsCurrentAddress={toggleSameAsCurrentAddress}
        disabled={readOnly}
      />

      {/* Documents */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">
          Document Uploads
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {["panCard", "aadhaarCard"].map((field) => (
            <ImageUploadField
              key={field}
              label={field === "panCard" ? "PAN Card" : "Aadhaar Card"}
              name={field}
              placeholder={`Upload ${field === "panCard" ? "PAN" : "Aadhaar"}`}
              file={form[field]}
              filePreview={form[`${field}Preview`]}
              onChange={handleFieldChange}
              disabled={readOnly}
              maxSizeInMB={5}
              acceptedFormats={[
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/gif",
              ]}
            />
          ))}
        </div>
      </div>

      {/* Nominees */}
      <NomineeSection
        nominees={form.nominees}
        errors={errors}
        onChange={handleFieldChange}
        nomineeRelations={NomineeRelationOptions.map((r) => r.value)}
        addNominee={() =>
          setForm((f) => ({
            ...f,
            nominees: [...(f.nominees ?? []), emptyNominee],
          }))
        }
        removeNominee={(i) =>
          setForm((f) => ({
            ...f,
            nominees: f.nominees?.filter((_, idx) => idx !== i),
          }))
        }
        toggleSameAsUserAddress={toggleNomineeAddress}
        disabled={readOnly}
      />

      {!readOnly && (
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : submitLabel}
        </button>
      )}
    </form>
  );
}
