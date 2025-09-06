"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  FormEvent,
  ChangeEvent,
} from "react";
import { fetchAllAccounts } from "@/lib/api/accounts";
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
    accountid: "",
    policyId: "",
  };

  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [accountOptions, setAccountOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [policyOptions, setPolicyOptions] = useState<
    { value: string; label: string; policy?: any }[]
  >([]);

  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

  /** -------- Effects -------- */
  useEffect(() => {
    fetchAllAccounts()
      .then((accounts) => {
        setAccountOptions(
          accounts.map((acc) => ({
            value: acc.id,
            label: `${acc.firstName} ${acc.lastName} (${acc.accountNumber})`,
          })),
        );
      })
      .catch(() => setAccountOptions([]));

    fetchAllLoanPolicies()
      .then((policies) => {
        setPolicyOptions(
          policies.map((policy) => ({
            value: policy.id,
            label: policy.name,
            policy,
          })),
        );
      })
      .catch(() => setPolicyOptions([]));
  }, []);

  /** -------- Handlers -------- */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => {
          const { [name]: _, ...rest } = prev;
          return rest;
        });
      }

      // Handle policy change separately
      if (name === "policyId") {
        const chosen = policyOptions.find((p) => p.value === value);
        if (chosen) {
          setSelectedPolicy(chosen.policy);
          setForm((prev) => ({
            ...prev,
            interestRate: chosen.policy.baseInterestRate,
            durationMonths: 0,
          }));
        }
      }
    },
    [errors, policyOptions],
  );

  const handleNumericChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitized = value.replace(/[^0-9.]/g, "");
    setForm((prev) => ({ ...prev, [name]: sanitized }));
  };

  const handleTermSelect = (term: number) => {
    if (!selectedPolicy) return;
    setForm((prev) => ({
      ...prev,
      durationMonths: term,
      emiAmount: calculateEMI(
        Number(prev.principal),
        Number(prev.interestRate),
        term,
      ),
    }));
  };

  const calculateEMI = (
    principal: number,
    interestRate: number,
    duration: number,
  ) => {
    if (!principal || !interestRate || !duration) return 0;
    const monthlyRate = interestRate / 100 / 12;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, duration)) /
      (Math.pow(1 + monthlyRate, duration) - 1)
    ).toFixed(2);
  };

  const handleSubmit = async (e: FormEvent) => {
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
    Object.entries(parsedForm).forEach(([key, value]) =>
      formData.append(key, String(value)),
    );

    try {
      if (onSubmit) await onSubmit(formData);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: "An unexpected error occurred. Please try again.",
      }));
    }
  };

  /** -------- Render -------- */
  return (
    <form
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow space-y-6"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Borrower */}
      <SelectField
        label="Account"
        id="accountid"
        value={form.accountid}
        onChange={handleChange}
        options={accountOptions}
        required
        error={errors.accountid}
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

      {/* Loan Policy */}
      <SelectField
        label="Loan Policy"
        id="policyId"
        value={form.policyId}
        onChange={handleChange}
        options={policyOptions}
        required
        error={errors.policyId}
        disabled={readOnly}
      />

      {/* If a policy is selected, show details */}
      {selectedPolicy && (
        <div className="space-y-4 border-t pt-4">
          <p className="text-gray-700 text-sm">
            <strong>Interest Rate:</strong> {selectedPolicy.baseInterestRate}%
          </p>
          <p className="text-gray-700 text-sm">
            <strong>Max Term:</strong> {selectedPolicy.maxTerm} months
          </p>

          {/* Term selector */}
          <div>
            <p className="font-semibold mb-2">Select Loan Term:</p>
            <div className="flex gap-4">
              {selectedPolicy.allowedTerms?.map((term: number) => (
                <label key={term} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="durationMonths"
                    value={term}
                    checked={form.durationMonths === term}
                    onChange={() => handleTermSelect(term)}
                    disabled={readOnly}
                  />
                  {term} Months
                </label>
              ))}
            </div>
          </div>

          {/* EMI Display */}
          {form.durationMonths > 0 && (
            <div className="bg-gray-100 p-3 rounded-md">
              <p>
                <strong>EMI:</strong> ₹{form.emiAmount}
              </p>
            </div>
          )}
        </div>
      )}

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
