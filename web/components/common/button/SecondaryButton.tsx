"use client";

interface SecondaryButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
}

export default function SecondaryButton({
  label,
  onClick,
  type = "button",
  disabled = false,
  ariaLabel,
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      className={`px-5 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {label}
    </button>
  );
}
