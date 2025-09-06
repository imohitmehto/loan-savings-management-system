"use client";
import React, {
  useState,
  useRef,
  useEffect,
  ChangeEventHandler,
  DragEventHandler,
} from "react";
import Image from "next/image";

export interface ImageUploadFieldProps {
  label: string;
  name: string;
  isCircular?: boolean;
  placeholder?: string;
  disabled?: boolean;
  maxSizeInMB?: number;
  acceptedFormats?: string[];
  onChange: (file: File | null) => void;
}

export default function ImageUploadField({
  label,
  name,
  isCircular = false,
  placeholder,
  disabled = false,
  maxSizeInMB = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  onChange,
}: ImageUploadFieldProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate preview URL when file changes
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl("");
  }, [file]);

  // Validate the selected file
  const validateFile = (f: File): string | null => {
    if (!acceptedFormats.includes(f.type)) {
      return `Only ${acceptedFormats.map((t) => t.split("/")[1]).join(", ")} are allowed.`;
    }
    if (f.size > maxSizeInMB * 1024 * 1024) {
      return `File must be < ${maxSizeInMB}MB.`;
    }
    return null;
  };

  // Handle file selection
  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected) {
      const err = validateFile(selected);
      if (err) {
        setError(err);
        return;
      }
      setError("");
      setFile(selected);
      onChange(selected);
    }
  };

  // Remove current file
  const handleDelete = () => {
    setFile(null);
    setError("");
    onChange(null);
  };

  // Open file picker
  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  // Drag & drop handlers
  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (disabled) return;
    const dtFile = e.dataTransfer.files[0];
    if (dtFile) {
      const err = validateFile(dtFile);
      if (err) {
        setError(err);
        return;
      }
      setError("");
      setFile(dtFile);
      onChange(dtFile);
    }
  };

  const shapeClasses = isCircular ? "rounded-full" : "rounded-lg";
  const sizeClasses = isCircular ? "w-32 h-32" : "w-48 h-48";

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={openPicker}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`border-2 border-dashed p-2 flex items-center justify-center
                    ${shapeClasses} ${sizeClasses} cursor-pointer
                    ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-500"}`}
        aria-label={label}
      >
        {previewUrl ? (
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={previewUrl}
              alt={`${label} preview`}
              fill
              className={`object-cover ${shapeClasses}`}
              unoptimized
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
              aria-label="Delete image"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>{placeholder || `Upload ${label}`}</p>
            <p className="text-xs">or drag & drop</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={acceptedFormats.join(",")}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
      <div className="mt-2 text-center">
        {error && (
          <p className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
            {error}
          </p>
        )}
        {!error && (
          <p className="text-xs text-gray-500">
            Max {maxSizeInMB}MB •{" "}
            {acceptedFormats
              .map((f) => f.split("/")[1].toUpperCase())
              .join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
