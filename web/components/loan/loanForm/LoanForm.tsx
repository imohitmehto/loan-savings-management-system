"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  FormEvent,
  ChangeEvent,
} from "react";
import { fetchAllAccounts } from "@/lib/api/accounts"; // For borrower list
import { fetchAllLoans } from "@/lib/api/loans";
import { fetchAllLoanPolicies } from "@/lib/api/loanPolicies";
import { Loan, LoanStatus } from "@/types/Loan";
import { LoanFormSchema } from "@/validators/LoanFormSchema";
import SelectField from "@/components/common/fields/SelectField";
import TextField from "@/components/common/fields/TextField";

interface LoanFormProps {
  initialValues?: Partial<Loan>;
  onSubmit?: (data: FormData) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
  readOnly?: boolean;
}

export default function LoanForm({
  initialValues = {},
  onSubmit,
  loading = false,
  submitLabel = "Create Loan",
  readOnly = false,
}: LoanFormProps) {
  /** -------- State -------- */
  const emptyForm: Partial<Loan> = {
    loanNumber: "",
    principal: 0,
    interestRate: 0,
    durationMonths: 0,
    emiAmount: 0,
    startDate: "",
    endDate: "",
    status: LoanStatus.PENDING,
    userId: "",
    loanTypeId: "",
    policyId: "",
  };

  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [accountOptions, setAccountOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [loanTypeOptions, setLoanTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [policyOptions, setPolicyOptions] = useState<
    { value: string; label: string }[]
  >([]);

  /** -------- Effects -------- */
  useEffect(() => {
    // Borrowers list (users with accounts)
    fetchAllAccounts()
      .then((accounts) => {
        setAccountOptions(
          accounts.map((acc) => ({
            value: acc.id,
            label: `${acc.firstName} ${acc.lastName} (${acc.accountNumber})`,
          })),
        );
      })
      .catch((err) => {
        console.error("Failed to fetch accounts:", err);
        setAccountOptions([]);
      });

    // Loan types list
    fetchAllLoans()
      .then((types) => {
        setLoanTypeOptions(
          types.map((type) => ({
            value: type.id,
            label: type.user.firstName || "Unnamed Loan Type", // Add a label, fallback if necessary
          })),
        );
      })
      .catch((err) => {
        console.error("Failed to fetch loan types:", err);
        setLoanTypeOptions([]);
      });

    // Loan policies list
    fetchAllLoanPolicies()
      .then((policies) => {
        setPolicyOptions(
          policies.map((policy) => ({
            value: policy.id,
            label: policy.name,
          })),
        );
      })
      .catch((err) => {
        console.error("Failed to fetch loan policies:", err);
        setPolicyOptions([]);
      });
  }, []);

  /** -------- Handlers -------- */

  // Generic change handler
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
          ["principal", "interestRate", "durationMonths", "emiAmount"].includes(
            name,
          )
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

  // Restrict number fields to numeric input
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

  // Submit handler
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const parsedForm = {
        ...form,
        principal: Number(form.principal),
        interestRate: Number(form.interestRate),
        durationMonths: Number(form.durationMonths),
        emiAmount: Number(form.emiAmount),
      };

      const result = LoanFormSchema.safeParse(parsedForm);
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
        formData.append(key, String(value));
      });

      try {
        if (onSubmit) {
          await onSubmit(formData);
        }
      } catch (err) {
        console.error("Loan submission failed:", err);
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
      {/* Loan Number */}
      <TextField
        label="Loan Number"
        id="loanNumber"
        value={form.loanNumber}
        onChange={handleChange}
        required
        error={errors.loanNumber}
        disabled={readOnly}
      />

      {/* Borrower */}
      <SelectField
        label="Borrower"
        id="userId"
        value={form.userId}
        onChange={handleChange}
        options={[{ value: "", label: "Select Borrower" }, ...accountOptions]}
        required
        error={errors.userId}
        disabled={readOnly}
      />

      {/* Loan Type */}
      <SelectField
        label="Loan Type"
        id="loanTypeId"
        value={form.loanTypeId}
        onChange={handleChange}
        options={[{ value: "", label: "Select Loan Type" }, ...loanTypeOptions]}
        required
        error={errors.loanTypeId}
        disabled={readOnly}
      />

      {/* Loan Policy */}
      <SelectField
        label="Loan Policy"
        id="policyId"
        value={form.policyId}
        onChange={handleChange}
        options={[{ value: "", label: "Select Policy" }, ...policyOptions]}
        required
        error={errors.policyId}
        disabled={readOnly}
      />

      {/* Principal */}
      <TextField
        label="Principal Amount"
        id="principal"
        type="text"
        inputMode="decimal"
        value={form.principal}
        onChange={handleNumericChange}
        required
        error={errors.principal}
        disabled={readOnly}
      />

      {/* Interest Rate */}
      <TextField
        label="Interest Rate (%)"
        id="interestRate"
        type="text"
        inputMode="decimal"
        value={form.interestRate}
        onChange={handleNumericChange}
        required
        error={errors.interestRate}
        disabled={readOnly}
      />

      {/* Duration Months */}
      <TextField
        label="Duration (Months)"
        id="durationMonths"
        type="text"
        inputMode="numeric"
        value={form.durationMonths}
        onChange={handleNumericChange}
        required
        error={errors.durationMonths}
        disabled={readOnly}
      />

      {/* EMI Amount */}
      <TextField
        label="EMI Amount"
        id="emiAmount"
        type="text"
        inputMode="decimal"
        value={form.emiAmount}
        onChange={handleNumericChange}
        required
        error={errors.emiAmount}
        disabled={readOnly}
      />

      {/* Start Date */}
      <TextField
        label="Start Date"
        id="startDate"
        type="date"
        value={form.startDate ? form.startDate.split("T")[0] : ""}
        onChange={handleChange}
        required
        error={errors.startDate}
        disabled={readOnly}
      />

      {/* End Date */}
      <TextField
        label="End Date"
        id="endDate"
        type="date"
        value={form.endDate ? form.endDate.split("T")[0] : ""}
        onChange={handleChange}
        required
        error={errors.endDate}
        disabled={readOnly}
      />

      {/* Status */}
      <SelectField
        label="Loan Status"
        id="status"
        value={form.status}
        onChange={handleChange}
        options={Object.values(LoanStatus).map((status) => ({
          value: status,
          label: status,
        }))}
        required
        error={errors.status}
        disabled={readOnly}
      />

      {/* Form-level error */}
      {errors.form && (
        <p className="text-red-500 text-sm text-center">{errors.form}</p>
      )}

      {/* Submit button */}
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
