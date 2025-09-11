import inputErrorClass from '@/utils/inputErrorClass.util';
import { ChangeEventHandler } from 'react';

export default function SelectField({
  label,
  id,
  value,
  onChange,
  options,
  required = false,
  error,
  disabled = false,
}: {
  label: string;
  id: string;
  value: string | number;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options: { value: string | number; label: string }[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      {/* Label */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {/* Select */}
      <select
        id={id}
        name={id}
        value={value ?? ''}
        onChange={e => {
          onChange(e);
        }}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={inputErrorClass(
          id,
          error ? { [id]: error } : {},
          `mt-1 block w-full rounded-md border bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
            disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
          }`
        )}
      >
        {required && !value && (
          <option value="" disabled>
            Select {label}
          </option>
        )}

        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Error message */}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
