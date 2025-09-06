"use client";
import React, { ChangeEventHandler } from "react";
import { AccountFormValues } from "@/types/AccountForm";
import { FaUserCheck } from "react-icons/fa6";
import TextField from "../../../common/fields/TextField";
import SelectField from "../../../common/fields/SelectField";
import { AccountTypeOptions } from "@/utils/enums/account-type.enum";
import { GenderOptions } from "@/utils/enums/gender.enum";
import { OccupationOptions } from "@/utils/enums/occupation.enum";

export default function PersonalInfoSection({
  form,
  errors,
  onChange,
  groupOptions,
  parentAccountOptions = [],
  disabled = false,
}: {
  parentAccountOptions?: { value: string; label: string }[];
  disabled?: boolean;
  form: Partial<AccountFormValues>;
  errors: Record<string, string>;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  groupOptions: { value: string; label: string }[];
}) {
  const isChildAccount = !!form.isChildAccount;

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
        <FaUserCheck className="w-6 h-6" />
        <span>Personal Information</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First Name */}
        <TextField
          label="First Name"
          id="firstName"
          name="firstName"
          value={form.firstName}
          onChange={onChange}
          required
          error={errors.firstName}
          autoComplete="given-name"
          disabled={disabled}
        />

        {/* Last Name */}
        <TextField
          label="Last Name"
          id="lastName"
          name="lastName"
          value={form.lastName}
          onChange={onChange}
          required
          error={errors.lastName}
          autoComplete="family-name"
          disabled={disabled}
        />

        {/* Father/Spouse */}
        <TextField
          label="Father/Spouse"
          id="fatherSpouse"
          name="fatherSpouse"
          value={form.fatherSpouse}
          onChange={onChange}
          required
          error={errors.fatherSpouse}
          disabled={disabled}
        />

        {/* Occupation */}
        <SelectField
          label="Occupation"
          id="occupation"
          name="occupation"
          value={form.occupation}
          onChange={onChange}
          options={OccupationOptions}
          required
          error={errors.occupation}
          disabled={disabled}
        />

        {/* Company/Institute */}
        <TextField
          label="Company/Institute"
          id="companyInstitute"
          name="companyInstitute"
          value={form.companyInstitute || ""}
          onChange={onChange}
          disabled={disabled}
        />

        {/* Email */}
        <TextField
          label="Email"
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
          error={errors.email}
          autoComplete="email"
          pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          title="Please enter a valid email address"
          disabled={disabled}
        />

        {/* Phone */}
        <TextField
          label="Phone"
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={onChange}
          onKeyDown={(e) => {
            if (
              !/[0-9]/.test(e.key) &&
              e.key !== "Backspace" &&
              e.key !== "Tab"
            ) {
              e.preventDefault();
            }
          }}
          required
          error={errors.phone}
          maxLength={10}
          inputMode="numeric"
          disabled={disabled}
        />

        {/* Gender */}
        <SelectField
          label="Gender"
          id="gender"
          name="gender"
          value={form.gender}
          onChange={onChange}
          options={GenderOptions}
          required
          error={errors.gender}
          disabled={disabled}
        />

        {/* DOB */}
        <TextField
          label="Date of Birth"
          id="dob"
          name="dob"
          type="date"
          value={form.dob}
          onChange={onChange}
          required
          error={errors.dob}
          max={new Date().toISOString().split("T")[0]}
          disabled={disabled}
        />

        {/* Account Type */}
        <SelectField
          label="Account Type"
          id="type"
          name="type"
          value={form.type}
          onChange={onChange}
          options={AccountTypeOptions}
          required
          error={errors.type}
          disabled={disabled}
        />

        {/* Group ID */}
        <SelectField
          label="Group"
          id="groupId"
          name="groupId"
          value={form.groupId || ""}
          onChange={onChange}
          options={[{ value: "", label: "Select Group" }, ...groupOptions]}
          error={errors.groupId}
          disabled={disabled}
        />

        {/* Parent Account (only show if child account) */}
        {isChildAccount && (
          <SelectField
            label="Parent Account"
            id="parentAccountId"
            name="parentAccountId"
            value={form.parentAccountId || ""}
            onChange={onChange}
            options={[
              { value: "", label: "Select Parent" },
              ...parentAccountOptions,
            ]}
            required
            error={errors.parentAccountId}
            disabled={disabled}
          />
        )}
      </div>
    </section>
  );
}
