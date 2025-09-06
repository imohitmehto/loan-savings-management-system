import React, { ChangeEventHandler, memo } from "react";
import { AccountFormValues, Address } from "@/types/AccountForm";
import { FaAddressCard } from "react-icons/fa";
import cx from "@/utils/cx.util";
import inputErrorClass from "@/utils/inputErrorClass.util";

interface AddressSectionProps {
  addresses: AccountFormValues["addresses"];
  errors: Record<string, string>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  toggleSameAsCurrentAddress: () => void;
  disabled?: boolean;
}

interface AddressFormProps {
  title: string;
  prefix: string;
  address: Address;
  errors: Record<string, string>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

const addressFields: {
  label: string;
  field: keyof Address;
  required?: boolean;
}[] = [
  { label: "Address Line 1", field: "addressLine1", required: true },
  { label: "Address Line 2", field: "addressLine2" },
  { label: "Landmark", field: "landmark" },
  { label: "City", field: "city", required: true },
  { label: "State", field: "state", required: true },
  { label: "Country", field: "country", required: true },
  { label: "Pin Code", field: "pinCode", required: true },
];

export const AddressSection = memo(function AddressSection({
  addresses,
  errors,
  onChange,
  toggleSameAsCurrentAddress,
  disabled = false,
}: AddressSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
        <FaAddressCard className="inline-block w-6 h-6" />
        <span>Addresses</span>
      </h2>

      <label
        className={`inline-flex items-center mb-4 space-x-2 ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
      >
        <input
          type="checkbox"
          checked={addresses.sameAsUserAddress ?? false}
          onChange={disabled ? undefined : toggleSameAsCurrentAddress}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-1 focus:ring-blue-500"
          aria-checked={addresses.sameAsUserAddress}
          disabled={disabled}
        />
        <span>Permanent address same as current address</span>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddressForm
          title="Current Address"
          prefix="addresses.current"
          address={addresses.current}
          errors={errors}
          onChange={onChange}
          disabled={disabled}
        />

        <AddressForm
          title="Permanent Address"
          prefix="addresses.permanent"
          address={addresses.permanent}
          errors={errors}
          onChange={onChange}
          disabled={disabled || addresses.sameAsUserAddress}
        />
      </div>
    </section>
  );
});

export const AddressForm = memo(function AddressForm({
  title,
  prefix,
  address = {} as Address,
  errors,
  onChange,
  disabled = false,
}: AddressFormProps) {
  return (
    <fieldset
      className={cx(
        "border border-gray-300 rounded-xl p-6 bg-gray-50 shadow-sm mb-6",
        disabled && "opacity-50 pointer-events-none"
      )}
      aria-disabled={disabled}
    >
      <legend className="font-semibold text-lg mb-4">{title}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addressFields.map(({ label, field, required }) => {
          const name = `${prefix}.${field}`;
          const errorMsg = errors?.[name];
          const errorId = `${name}-error`;

          return (
            <div key={field}>
              <label htmlFor={name} className="block mb-1 font-medium">
                {label} {required && <span className="text-red-600">*</span>}
              </label>
              <input
                id={name}
                name={name}
                type="text"
                required={required}
                aria-required={required}
                disabled={disabled}
                value={address?.[field] ?? ""}
                onChange={onChange}
                className={
                  inputErrorClass(name, errors, "border rounded p-2 w-full") +
                  (disabled ? " opacity-50 cursor-not-allowed bg-gray-100" : "")
                }
                autoComplete="off"
                aria-invalid={!!errorMsg}
                aria-describedby={errorMsg ? errorId : undefined}
              />
              {errorMsg && (
                <p id={errorId} className="text-red-600 text-sm mt-1">
                  {errorMsg}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
});
