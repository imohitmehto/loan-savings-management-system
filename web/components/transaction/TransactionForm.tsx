"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  FormEvent,
  ChangeEvent,
} from "react";
import { fetchAllAccounts } from "@/lib/api/accounts";
import {
  Transaction,
  TransactionType,
  TransactionStatus,
  PaymentMode,
  TransactionDirection,
} from "@/types/Transaction";
import { TransactionFormSchema } from "@/validators/TransactionFormSchema";
import SelectField from "@/components/common/fields/SelectField";
import TextField from "@/components/common/fields/TextField";

/**
 * TransactionForm Component
 * - Renders and handles the transaction form operations
 * - Supports account-aware and account-less transaction types
 * - Validates using TransactionFormSchema
 */

interface TransactionFormProps {
  initialValues?: Partial<Transaction>;
  onSubmit?: (data: FormData) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
  readOnly?: boolean;
}

/** Transaction types that don't require an account */
const NO_ACCOUNT_NEEDED: TransactionType[] = [
  TransactionType.BANK_TO_CASH,
  TransactionType.CASH_TO_BANK,
  TransactionType.BANK_TO_FD,
];

/** Mapping for auto-assigning credit/debit direction based on type */
const CREDIT_TYPES: TransactionType[] = [
  TransactionType.MONTHLY_PAYMENT,
  TransactionType.LOAN_REPAYMENT,
  TransactionType.BANK_TO_CASH,
];
const DEBIT_TYPES: TransactionType[] = [
  TransactionType.DEBIT,
  TransactionType.LOAN_DEBIT,
  TransactionType.PENALTY,
  TransactionType.CASH_TO_BANK,
  TransactionType.BANK_TO_FD,
  TransactionType.EXPENSE,
];

export default function TransactionForm({
  initialValues = {},
  onSubmit,
  loading = false,
  submitLabel = "Create Transaction",
  readOnly = false,
}: TransactionFormProps) {
  /** ----------- State ----------- */
  const emptyForm: Partial<Transaction> = {
    accountId: "",
    type: TransactionType.MONTHLY_PAYMENT,
    transactionDirection: TransactionDirection.CREDIT,
    amount: 0,
    description: "",
    paymentMode: PaymentMode.UPI,
    status: TransactionStatus.PENDING,
  };

  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [accountOptions, setAccountOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const accountDisabled =
    readOnly || NO_ACCOUNT_NEEDED.includes(form.type as TransactionType);

  /** ----------- Effects ----------- */

  // Load account options from API
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const accounts = await fetchAllAccounts();
        if (Array.isArray(accounts)) {
          setAccountOptions(
            accounts.map((acc) => ({
              value: acc.id,
              label: `${acc.firstName} ${acc.lastName} (${acc.accountNumber})`,
            })),
          );
        } else {
          setAccountOptions([]);
        }
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
        setAccountOptions([]);
      }
    };
    loadAccounts();
  }, []);

  // Auto-set transaction direction & clear account when needed
  useEffect(() => {
    if (CREDIT_TYPES.includes(form.type)) {
      setForm((prev) => ({
        ...prev,
        transactionDirection: TransactionDirection.CREDIT,
      }));
    } else if (DEBIT_TYPES.includes(form.type)) {
      setForm((prev) => ({
        ...prev,
        transactionDirection: TransactionDirection.DEBIT,
      }));
    }

    // Clear accountId if not needed
    if (NO_ACCOUNT_NEEDED.includes(form.type)) {
      setForm((prev) => ({ ...prev, accountId: "" }));
    }
  }, [form.type]);

  /** ----------- Handlers ----------- */

  // Generic field change handler
  const handleChange = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const { name, value, type } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));

      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => {
          const { [name]: _, ...rest } = prev;
          return rest;
        });
      }
    },
    [errors],
  );

  // Numeric input handler for amount (disallows letters)
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

  // Form submit handler
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const parsedForm = {
        ...form,
        amount:
          typeof form.amount === "string" ? Number(form.amount) : form.amount,
      };

      // Skip accountId validation if account is not needed
      const schemaToUse = accountDisabled
        ? TransactionFormSchema.omit({ accountId: true })
        : TransactionFormSchema;

      const result = schemaToUse.safeParse(parsedForm);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          fieldErrors[err.path.join(".")] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      // Build FormData for submission
      const formData = new FormData();
      if (!accountDisabled) formData.append("accountId", form.accountId);
      formData.append("type", form.type);
      formData.append("transactionDirection", form.transactionDirection);
      formData.append("amount", String(parsedForm.amount));
      formData.append("paymentMode", form.paymentMode);
      if (form.description) formData.append("description", form.description);
      formData.append("status", form.status);

      try {
        await onSubmit(formData);
      } catch (err) {
        console.error("Transaction submission failed:", err);
        setErrors((prev) => ({
          ...prev,
          form: "An unexpected error occurred. Please try again.",
        }));
      }
    },
    [form, onSubmit, accountDisabled],
  );

  /** ----------- Render ----------- */
  return (
    <form
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow space-y-6"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Transaction Type */}
      <SelectField
        label="Transaction Type"
        id="type"
        value={form.type}
        onChange={handleChange}
        options={Object.values(TransactionType).map((t) => ({
          value: t,
          label: t.replace(/_/g, " "),
        }))}
        required
        error={errors.type}
        disabled={readOnly}
      />

      {/* Transaction Direction */}
      <SelectField
        label="Transaction Direction"
        id="transactionDirection"
        value={form.transactionDirection}
        onChange={handleChange}
        options={Object.values(TransactionDirection).map((d) => ({
          value: d,
          label: d,
        }))}
        required
        error={errors.transactionDirection}
        disabled={!readOnly} // Only editable if form is read-only (admin override?)
      />

      {/* Account Field - Disabled for no-account types */}
      <SelectField
        label="Account"
        id="accountId"
        value={form.accountId}
        onChange={handleChange}
        options={[{ value: "", label: "Select Account" }, ...accountOptions]}
        required={!accountDisabled}
        error={errors.accountId}
        disabled={accountDisabled}
      />

      {/* Amount */}
      <TextField
        label="Amount"
        id="amount"
        type="text"
        inputMode="decimal"
        value={form.amount}
        onChange={handleNumericChange}
        required
        error={errors.amount}
        disabled={readOnly}
      />

      {/* Payment Mode */}
      <SelectField
        label="Payment Mode"
        id="paymentMode"
        value={form.paymentMode}
        onChange={handleChange}
        options={Object.values(PaymentMode).map((pm) => ({
          value: pm,
          label: pm.replace(/_/g, " "),
        }))}
        required
        error={errors.paymentMode}
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

      {/* Status */}
      <SelectField
        label="Status"
        id="status"
        value={form.status}
        onChange={handleChange}
        options={Object.values(TransactionStatus).map((status) => ({
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
