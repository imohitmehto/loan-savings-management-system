import { forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: "user" | "lock";
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, icon, error, ...props }, ref) => {
    return (
      <div className="mb-4 relative">
        {icon && (
          <span className="absolute left-3 top-2.5 text-gray-900">
            <i className={`fas fa-${icon}`} />
          </span>
        )}
        <input
          {...props}
          ref={ref}
          className="w-full pl-10 pr-3 py-2 bg-white/40 text-black placeholder-gray-200 border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    );
  },
);

InputField.displayName = "InputField";
export default InputField;
