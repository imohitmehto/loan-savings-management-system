"use client";

import React, { useState, useCallback, FormEvent, ChangeEvent } from "react";
import { LoanPolicy } from "@/types/LoanPolicy";
import { LoanPolicyFormSchema } from "@/validators/LoanPolicyFormSchema";
import SelectField from "@/components/common/fields/SelectField";
import TextField from "@/components/common/fields/TextField";

interface LoanPolicyFormProps {
  initialValues?: Partial<LoanPolicy>;
  onSubmit?: (data: FormData) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
  readOnly?: boolean;
}

export default function LoanPolicyForm({
  initialValues = {},
  onSubmit,
  loading = false,
  submitLabel = "Create Loan Policy",
  readOnly = false,
}: LoanPolicyFormProps) {
  /** -------- Initial State -------- */
  const emptyForm: Partial<LoanPolicy> = {
    name: "",
    description: "",
    interestRate: null,
    minCreditScore: 0,
    maxLoanAmount: 0,
    rules: {},
    isActive: true,
  };

  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});

  /** -------- Handlers -------- */
  const handleChange = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const { name, value, type } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]:
          type === "number" ||
          ["interestRate", "minCreditScore", "maxLoanAmount"].includes(name)
            ? Number(value)
            : value,
      }));

      if (errors[name]) {
        setErrors((prev) => {
          const { [name]: _, ...rest } = prev;
          return rest;
        });
      }
    },
    [errors],
  );

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitized = value
      .replace(/[^0-9.]/g, "")
      .replace(/^(\d*\.\d{0,2}).*$/, "$1");
    setForm((prev) => ({ ...prev, [name]: sanitized }));

    if (errors[name]) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const parsedForm = {
        ...form,
        interestRate:
          form.interestRate !== null ? Number(form.interestRate) : null,
        minCreditScore: Number(form.minCreditScore),
        maxLoanAmount: Number(form.maxLoanAmount),
      };

      const result = LoanPolicyFormSchema.safeParse(parsedForm);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          fieldErrors[err.path.join(".")] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      const formData = new FormData();
      Object.entries(parsedForm).forEach(([key, value]) => {
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value),
        );
      });

      try {
        if (onSubmit) {
          await onSubmit(formData);
        }
      } catch (err) {
        console.error("Loan Policy submission failed:", err);
        setErrors((prev) => ({
          ...prev,
          form: "An unexpected error occurred. Please try again.",
        }));
      }
    },
    [form, onSubmit],
  );

  /** -------- Render -------- */
  return (
    <form
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow space-y-6"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Name */}
      <TextField
        label="Policy Name"
        id="name"
        value={form.name}
        onChange={handleChange}
        required
        error={errors.name}
        disabled={readOnly}
      />

      {/* Description */}
      <TextField
        label="Description"
        id="description"
        value={form.description || ""}
        onChange={handleChange}
        multiline
        rows={3}
        error={errors.description}
        disabled={readOnly}
      />

      {/* Interest Rate */}
      <TextField
        label="Interest Rate (%)"
        id="interestRate"
        type="text"
        inputMode="decimal"
        value={form.interestRate ?? ""}
        onChange={handleNumericChange}
        error={errors.interestRate}
        disabled={readOnly}
      />

      {/* Min Credit Score */}
      <TextField
        label="Minimum Credit Score"
        id="minCreditScore"
        type="text"
        inputMode="numeric"
        value={form.minCreditScore}
        onChange={handleNumericChange}
        required
        error={errors.minCreditScore}
        disabled={readOnly}
      />

      {/* Max Loan Amount */}
      <TextField
        label="Maximum Loan Amount"
        id="maxLoanAmount"
        type="text"
        inputMode="decimal"
        value={form.maxLoanAmount}
        onChange={handleNumericChange}
        required
        error={errors.maxLoanAmount}
        disabled={readOnly}
      />

      {/* Rules */}
      <TextField
        label="Policy Rules (JSON format)"
        id="rules"
        value={JSON.stringify(form.rules, null, 2)}
        onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            setForm((prev) => ({ ...prev, rules: parsed }));
            if (errors.rules) {
              setErrors((prev) => {
                const { rules, ...rest } = prev;
                return rest;
              });
            }
          } catch {
            setErrors((prev) => ({ ...prev, rules: "Invalid JSON" }));
          }
        }}
        multiline
        rows={4}
        error={errors.rules}
        disabled={readOnly}
      />

      {/* Status */}
      <SelectField
        label="Status"
        id="isActive"
        value={form.isActive ? "true" : "false"}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, isActive: e.target.value === "true" }))
        }
        options={[
          { value: "true", label: "Active" },
          { value: "false", label: "Inactive" },
        ]}
        required
        error={errors.isActive}
        disabled={readOnly}
      />

      {/* Form-level error */}
      {errors.form && (
        <p className="text-red-500 text-sm text-center">{errors.form}</p>
      )}

      {/* Submit */}
      {!readOnly && (
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : submitLabel}
        </button>
      )}
    </form>
  );
}
