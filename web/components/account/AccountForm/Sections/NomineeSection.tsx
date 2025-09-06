"use client";
import { Nominee } from "@/types/AccountForm";
import { FaUserFriends } from "react-icons/fa";
import { AddressForm } from "./AddressSection";
import cx from "@/utils/cx.util";
import TextField from "@/components/common/fields/TextField";
import SelectField from "@/components/common/fields/SelectField";

import { ChangeEventHandler } from "react";

export function NomineeSection({
  nominees,
  errors,
  onChange,
  nomineeRelations,
  addNominee,
  removeNominee,
  toggleSameAsUserAddress,
  disabled = false,
}: {
  nominees: Nominee[];
  errors: Record<string, string>;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  nomineeRelations: string[];
  addNominee: () => void;
  removeNominee: (idx: number) => void;
  toggleSameAsUserAddress: (idx: number) => void;
  disabled?: boolean;
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
        <span className="inline-block w-6 h-6">
          <FaUserFriends />
        </span>
        <span>Nominees</span>
        {!disabled && (
          <button
            type="button"
            onClick={addNominee}
            className="ml-auto inline-flex items-center px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
            aria-label="Add nominee"
          >
            +
          </button>
        )}
      </h2>

      {nominees.length === 0 && (
        <p className="italic text-gray-500">No nominees added</p>
      )}

      <div className="space-y-6">
        {nominees.map((nominee, idx) => (
          <NomineeForm
            key={idx}
            nominee={nominee}
            index={idx}
            errors={errors}
            onChange={onChange}
            remove={() => removeNominee(idx)}
            nomineeRelations={nomineeRelations}
            toggleSameAsUserAddress={() => toggleSameAsUserAddress(idx)}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  );
}

function NomineeForm({
  nominee,
  index,
  errors,
  onChange,
  remove,
  nomineeRelations,
  toggleSameAsUserAddress,
  disabled = false,
}: {
  nominee: Nominee;
  index: number;
  errors: Record<string, string>;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  remove: () => void;
  nomineeRelations: string[];
  toggleSameAsUserAddress: () => void;
  disabled?: boolean;
}) {
  const name = (field: string) => `nominees.${index}.${field}`;

  return (
    <fieldset
      className={`border border-gray-300 rounded p-6 bg-white shadow-sm relative ${
        disabled ? "opacity-50" : ""
      }`}
      aria-disabled={disabled}
    >
      {/* Remove nominee */}
      {!disabled && (
        <button
          type="button"
          onClick={remove}
          className="absolute top-3 right-3 inline-flex items-center justify-center px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
          aria-label={`Remove nominee ${index + 1}`}
        >
          X
        </button>
      )}

      <legend className="font-semibold text-lg mb-4">
        Nominee #{index + 1}
      </legend>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <TextField
          label="First Name"
          id={name("firstName")}
          value={nominee.firstName || ""}
          onChange={onChange}
          required
          disabled={disabled}
          error={errors[name("firstName")]}
        />

        {/* Last Name */}
        <TextField
          label="Last Name"
          id={name("lastName")}
          value={nominee.lastName || ""}
          onChange={onChange}
          required
          disabled={disabled}
          error={errors[name("lastName")]}
        />

        {/* Relation */}
        <div className="sm:col-span-2">
          <SelectField
            label="Relation"
            id={name("relation")}
            value={nominee.relation || ""}
            onChange={onChange}
            required
            disabled={disabled}
            error={errors[name("relation")]}
            options={nomineeRelations.map((rel) => ({
              value: rel,
              label: rel,
            }))}
          />
        </div>

        {/* Email */}
        <TextField
          label="Email"
          type="email"
          id={name("email")}
          value={nominee.email || ""}
          onChange={onChange}
          disabled={disabled}
          error={errors[name("email")]}
        />

        {/* Phone */}
        <TextField
          label="Phone Number"
          type="tel"
          id={name("phoneNumber")}
          value={nominee.phoneNumber || ""}
          onChange={onChange}
          disabled={disabled}
          error={errors[name("phoneNumber")]}
        />

        {/* Same as User Address */}
        <div className="sm:col-span-2 flex items-center space-x-2">
          <input
            type="checkbox"
            id={name("sameAsUserAddress")}
            name={name("sameAsUserAddress")}
            checked={!!nominee.sameAsUserAddress}
            onChange={
              disabled ? undefined : () => toggleSameAsUserAddress(index)
            }
            disabled={disabled}
          />
          <label
            htmlFor={name("sameAsUserAddress")}
            className={
              disabled
                ? "cursor-not-allowed opacity-50 select-none"
                : "cursor-pointer select-none"
            }
          >
            Same as user's current address
          </label>
        </div>

        {/* Nominee Address */}
        <div
          className={cx(
            "sm:col-span-2 border border-gray-300 rounded p-4 bg-gray-50",
            nominee.sameAsUserAddress && "opacity-50 pointer-events-none"
          )}
        >
          <h3 className="font-semibold text-lg mb-3">Nominee Address</h3>
          <AddressForm
            title="Address"
            prefix={`${name("address")}`}
            address={nominee.address}
            errors={errors}
            onChange={onChange}
            disabled={disabled || nominee.sameAsUserAddress}
          />
        </div>
      </div>
    </fieldset>
  );
}
