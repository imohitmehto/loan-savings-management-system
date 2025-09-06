"use client";

import TextField from "@/components/common/fields/TextField";
import SelectField from "@/components/common/fields/SelectField";
import {
  FeeTypeOptions,
  InterestOptions,
  TermPeriodOptions,
} from "@/utils/enums/loan-policy-enum";
import { LoanPolicy } from "@/types/LoanPolicy";
import { ChangeEventHandler, Dispatch, SetStateAction } from "react";

interface Props {
  form: Partial<LoanPolicy>;
  errors: Record<string, string>;
  readOnly: boolean;
  handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  handleNumericChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  setForm: Dispatch<SetStateAction<LoanPolicy>>;
}

export default function LoanPolicyFields({
  form,
  errors,
  readOnly,
  handleChange,
  handleNumericChange,
  setForm,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Basic Fields */}
      <TextField
        label="Policy Name"
        name="name"
        id="name"
        value={form.name}
        onChange={handleChange}
        required
        error={errors.name}
        disabled={readOnly}
      />

      <TextField
        label="Description"
        name="description"
        id="description"
        value={form.description || ""}
        onChange={handleChange}
        multiline
        rows={3}
        error={errors.description}
        disabled={readOnly}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <TextField
          label="Min Amount (₹)"
          name="minAmount"
          id="minAmount"
          type="text"
          inputMode="decimal"
          value={form.minAmount}
          onChange={handleNumericChange}
          required
          error={errors.minAmount}
          disabled={readOnly}
        />

        <TextField
          label="Max Amount (₹)"
          name="maxAmount"
          id="maxAmount"
          type="text"
          inputMode="decimal"
          value={form.maxAmount}
          onChange={handleNumericChange}
          required
          error={errors.maxAmount}
          disabled={readOnly}
        />

        <SelectField
          label="Interest Type"
          id="interestType"
          value={form.interestType || ""}
          onChange={handleChange}
          options={InterestOptions}
          required
          error={errors.interestType}
          disabled={readOnly}
        />

        <TextField
          label="Interest Rate (%)"
          name="interestRate"
          id="interestRate"
          type="text"
          inputMode="decimal"
          value={form.interestRate ?? ""}
          onChange={handleNumericChange}
          error={errors.interestRate}
          disabled={readOnly}
        />

        <SelectField
          label="Term Period "
          id="termPeriod"
          value={form.termPeriod || ""}
          onChange={handleChange}
          options={TermPeriodOptions}
          required
          error={errors.termPeriod}
          disabled={readOnly}
        />

        <TextField
          label="Maximum Term"
          name="maxTerm"
          id="maxTerm"
          type="text"
          inputMode="numeric"
          value={form.maxTerm}
          onChange={handleNumericChange}
          required
          error={errors.maxTerm}
          disabled={readOnly}
        />

        <SelectField
          label="Application Fee Type"
          id="applicationFeeType"
          value={form.applicationFeeType || ""}
          onChange={handleChange}
          options={FeeTypeOptions}
          required
          error={errors.applicationFeeType}
          disabled={readOnly}
        />

        <TextField
          label="Application Fee"
          name="applicationFee"
          id="applicationFee"
          type="text"
          inputMode="decimal"
          value={form.applicationFee}
          onChange={handleNumericChange}
          required
          error={errors.applicationFee}
          disabled={readOnly}
        />

        <SelectField
          label="Processing Fee Type"
          id="processingFeeType"
          value={form.processingFeeType || ""}
          onChange={handleChange}
          options={FeeTypeOptions}
          required
          error={errors.processingFeeType}
          disabled={readOnly}
        />

        <TextField
          label="Processing Fee"
          name="processingFee"
          id="processingFee"
          type="text"
          inputMode="decimal"
          value={form.processingFee}
          onChange={handleNumericChange}
          required
          error={errors.processingFee}
          disabled={readOnly}
        />

        <SelectField
          label="Late Payment Penalties Type"
          id="latePaymentPenaltiesType"
          value={form.latePaymentPenaltiesType || ""}
          onChange={handleChange}
          options={FeeTypeOptions}
          required
          error={errors.latePaymentPenaltiesType}
          disabled={readOnly}
        />

        <TextField
          label="Late Payment Penalties (Per Month)"
          name="latePaymentPenalties"
          id="latePaymentPenalties"
          value={form.latePaymentPenalties}
          onChange={handleChange}
          required
          error={errors.latePaymentPenalties}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}
