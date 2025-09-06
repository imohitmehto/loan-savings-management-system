"use client";

import { LoanPolicy } from "@/types/LoanPolicy";
import LoanPolicyFields from "./LoanPolicyFields";
import LoanPolicyRules from "./LoanPolicyRules";
import { useLoanPolicyForm } from "@/hooks/useLoanPolicyForm";

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
  const {
    form,
    rules,
    errors,
    setForm,
    handleChange,
    handleNumericChange,
    handleRuleChange,
    addRule,
    removeRule,
    handleSubmit,
  } = useLoanPolicyForm(initialValues, onSubmit);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow space-y-6"
      noValidate
    >
      <LoanPolicyFields
        form={form}
        errors={errors}
        readOnly={readOnly}
        handleChange={handleChange}
        handleNumericChange={handleNumericChange}
        setForm={setForm}
      />

      <LoanPolicyRules
        rules={rules}
        errors={errors}
        readOnly={readOnly}
        handleRuleChange={handleRuleChange}
        addRule={addRule}
        removeRule={removeRule}
      />

      {errors.form && <p className="text-red-500 text-center">{errors.form}</p>}

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
