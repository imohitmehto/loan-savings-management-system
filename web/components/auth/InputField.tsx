'use client';

import React, { forwardRef, useState } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; // Descriptive label for accessibility
  icon?: 'user' | 'lock' | 'envelope' | 'phone'; // Optional FontAwesome icon
  error?: string; // Optional field-level error message
}

/**
 * InputField - A reusable form input with optional icon and validation feedback.
 *
 * @param label - Describes the field for screen readers.
 * @param icon - FontAwesome icon type (e.g. user, lock).
 * @param error - Validation error string.
 * @param props - Native input props forwarded from React Hook Form or manually.
 * @returns JSX.Element
 */
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, icon, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className="mb-4 relative">
        <label className="sr-only" htmlFor={props.id || props.name}>
          {label}
        </label>

        {icon && (
          <span className="absolute left-3 top-2.5 text-gray-900 pointer-events-none">
            <i className={`fas fa-${icon}`} />
          </span>
        )}

        <input
          suppressHydrationWarning
          {...props}
          ref={ref}
          type={inputType}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.name}-error` : undefined}
          className={`w-full pl-10 pr-10 py-2 bg-white/40 text-black placeholder-gray-200 border rounded focus:outline-none focus:ring-2 focus:ring-blue-700 ${
            error ? 'border-red-400 focus:ring-red-500' : 'border-white/30'
          }`}
        />

        {type === 'password' && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-2.5 text-gray-700 bg-transparent border-0 p-0 focus:outline-none cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`} />
          </button>
        )}

        {error && (
          <p id={`${props.name}-error`} className="text-red-400 text-sm mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
export default InputField;
