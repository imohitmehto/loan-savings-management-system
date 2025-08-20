import { Nominee } from "@/types/AccountForm";
import inputErrorClass from "@/utils/inputErrorClass";
import { ChangeEventHandler } from "react";
import { FaUserFriends } from "react-icons/fa";
import { AddressForm } from "./AddressSection";
import cx from "@/utils/cx";

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
  removeNominee: (index: number) => void;
  toggleSameAsUserAddress: (index: number) => void;
  disabled?: boolean;
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
        <span className="inline-block w-6 h-6 ">
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
  const baseClass = "border rounded p-2 w-full";
  const name = (field: string) => `nominees.${index}.${field}`;

  return (
    <fieldset
      className={`border border-gray-300 rounded p-6 bg-white shadow-sm relative ${
        disabled ? "opacity-50" : ""
      }`}
      aria-disabled={disabled}
    >
      {index >= 0 && !disabled && (
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
        <div>
          <label htmlFor={name("firstName")} className="block mb-1 font-medium">
            First Name <span className="text-red-600">*</span>
          </label>
          <input
            id={name("firstName")}
            name={name("firstName")}
            type="text"
            value={nominee.firstName || ""}
            onChange={onChange}
            required
            disabled={disabled}
            className={
              inputErrorClass(name("firstName"), errors, baseClass) +
              (disabled ? " opacity-50 cursor-not-allowed bg-gray-100" : "")
            }
          />
          {errors[name("firstName")] && (
            <p className="text-red-600 mt-1 text-sm">
              {errors[name("firstName")]}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor={name("lastName")} className="block mb-1 font-medium">
            Last Name <span className="text-red-600">*</span>
          </label>
          <input
            id={name("lastName")}
            name={name("lastName")}
            type="text"
            value={nominee.lastName || ""}
            onChange={onChange}
            required
            disabled={disabled}
            className={
              inputErrorClass(name("lastName"), errors, baseClass) +
              (disabled ? " opacity-50 cursor-not-allowed bg-gray-100" : "")
            }
          />
          {errors[name("lastName")] && (
            <p className="text-red-600 mt-1 text-sm">
              {errors[name("lastName")]}
            </p>
          )}
        </div>

        {/* Relation */}
        <div className="sm:col-span-2">
          <label htmlFor={name("relation")} className="block mb-1 font-medium">
            Relation <span className="text-red-600">*</span>
          </label>
          <select
            id={name("relation")}
            name={name("relation")}
            value={nominee.relation || ""}
            onChange={onChange}
            required
            disabled={disabled}
            className={
              inputErrorClass(name("relation"), errors, baseClass) +
              (disabled ? " opacity-50 cursor-not-allowed bg-gray-100" : "")
            }
          >
            <option value="">Select Relation</option>
            {nomineeRelations.map((rel) => (
              <option key={rel} value={rel}>
                {rel}
              </option>
            ))}
          </select>
          {errors[name("relation")] && (
            <p className="text-red-600 mt-1 text-sm">
              {errors[name("relation")]}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor={name("email")} className="block mb-1 font-medium">
            Email
          </label>
          <input
            id={name("email")}
            name={name("email")}
            type="email"
            value={nominee.email || ""}
            onChange={onChange}
            disabled={disabled}
            className={
              inputErrorClass(name("email"), errors, baseClass) +
              (disabled ? " opacity-50 cursor-not-allowed bg-gray-100" : "")
            }
          />
          {errors[name("email")] && (
            <p className="text-red-600 mt-1 text-sm">{errors[name("email")]}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor={name("phoneNumber")}
            className="block mb-1 font-medium"
          >
            Phone Number
          </label>
          <input
            id={name("phoneNumber")}
            name={name("phoneNumber")}
            type="tel"
            value={nominee.phoneNumber || ""}
            onChange={onChange}
            // removed required to match backend
            disabled={disabled}
            aria-invalid={!!errors[name("phoneNumber")]}
            aria-describedby={
              errors[name("phoneNumber")]
                ? `${name("phoneNumber")}-error`
                : undefined
            }
            className={
              inputErrorClass(name("phoneNumber"), errors, baseClass) +
              (disabled ? " opacity-50 cursor-not-allowed bg-gray-100" : "")
            }
          />
          {errors[name("phoneNumber")] && (
            <p
              id={`${name("phoneNumber")}-error`}
              className="text-red-600 mt-1 text-sm"
            >
              {errors[name("phoneNumber")]}
            </p>
          )}
        </div>

        {/* Same as User Address */}
        <div className="sm:col-span-2 flex items-center space-x-2">
          <input
            type="checkbox"
            id={name("sameAsUserAddress")}
            name={name("sameAsUserAddress")}
            checked={nominee.sameAsUserAddress}
            onChange={disabled ? undefined : () => toggleSameAsUserAddress()}
            disabled={disabled}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-1 focus:ring-blue-500"
          />
          <label
            htmlFor={name("sameAsUserAddress")}
            className={
              disabled
                ? "cursor-not-allowed opacity-50 select-none"
                : "cursor-pointer select-none"
            }
          >
            Same as user&#39;s current address
          </label>
        </div>

        {/* Nominee Address */}
        <div
          className={cx(
            "sm:col-span-2 border border-gray-300 rounded p-4 bg-gray-50",
            nominee.sameAsUserAddress && "opacity-50 pointer-events-none",
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
