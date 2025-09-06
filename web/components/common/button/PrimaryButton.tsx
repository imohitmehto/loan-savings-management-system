"use client";

interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export default function PrimaryButton({
  label,
  onClick,
  type = "button",
  disabled = false,
  ariaLabel,
  className = "",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      className={`px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-bold
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}`}
    >
      {label}
    </button>
  );
}
