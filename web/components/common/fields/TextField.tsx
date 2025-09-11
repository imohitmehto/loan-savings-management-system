import {
  ChangeEventHandler,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import inputErrorClass from '@/utils/inputErrorClass.util';

type BaseProps = {
  label: string;
  id: string;
  name?: string; // Optional name prop, defaults to id
  value: string | number;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  required?: boolean;
  error?: string;
  type?: string;
  max?: string;
  autoComplete?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
};

type TextFieldProps = BaseProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'onChange'
    | 'id'
    | 'name'
    | 'type'
    | 'required'
    | 'autoComplete'
    | 'disabled'
  > &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    | 'value'
    | 'onChange'
    | 'id'
    | 'name'
    | 'required'
    | 'autoComplete'
    | 'disabled'
  >;

export default function TextField({
  label,
  id,
  name,
  value,
  onChange,
  required = false,
  error,
  type = 'text',
  max,
  autoComplete,
  disabled = false,
  multiline = false,
  rows = 3,
  ...rest
}: TextFieldProps) {
  const inputName = name || id;
  const errorId = `${id}-error`;

  return (
    <div>
      {/* Label */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {/* Input or Textarea */}
      {multiline ? (
        <textarea
          id={id}
          name={inputName}
          value={value ?? ''}
          onChange={onChange}
          required={required}
          rows={rows}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...rest}
          className={inputErrorClass(
            inputName,
            error ? { [inputName]: error } : {},
            `mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`
          )}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={inputName}
          value={value ?? ''}
          onChange={onChange}
          required={required}
          max={max}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...rest}
          className={inputErrorClass(
            inputName,
            error ? { [inputName]: error } : {},
            `mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`
          )}
        />
      )}

      {/* Error */}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
