"use client";

import { FileUploadFieldProps } from "@/types/AccountForm";
import Image from "next/image";

export default function FileUploadField({
  label,
  name,
  file,
  filePreview,
  accept = "image/*,application/pdf",
  onChange,
  isCircular = false,
  placeholder,
  disabled = false,
}: FileUploadFieldProps & { disabled?: boolean }) {
  const isImage = file?.type?.startsWith("image/") || (!file && !!filePreview);
  const displayLabel = placeholder || `Click here to Upload ${label}`;

  return (
    <div
      className={`flex flex-col items-center ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <label
        htmlFor={disabled ? undefined : name}
        className={`${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } border border-dashed border-gray-300 ${
          !disabled && "hover:border-blue-500"
        } flex flex-col items-center justify-center
          ${isCircular ? "rounded-full p-1 w-32 h-32" : "rounded p-2 w-40 h-40"}
          overflow-hidden bg-gray-50`}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
          }
        }}
      >
        {file ? (
          // Show file name
          <div className="text-center text-sm text-gray-700 truncate max-w-full px-1">
            {file.name}
          </div>
        ) : isImage && filePreview ? (
          // Show preview image
          <Image
            src={filePreview}
            alt={label}
            fill
            className={`${
              isCircular
                ? "object-cover w-full h-full rounded-full"
                : "max-h-full max-w-full object-contain"
            }`}
          />
        ) : (
          // Placeholder text
          <span className="text-gray-500 text-center text-sm px-1">
            {displayLabel}
          </span>
        )}

        {/* Actual hidden file input */}
        <input
          type="file"
          id={name}
          name={name}
          accept={accept}
          onChange={onChange}
          className="hidden"
          disabled={disabled}
        />
      </label>
      <p className="mt-2 text-sm text-gray-600 text-center">{label}</p>
    </div>
  );
}
