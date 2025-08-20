"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface NavigationButtonProps {
  route: string; // Destination route
  label: string; // Button text
  className?: string; // Extra Tailwind classes if needed
}

export default function NavigationButton({
  route,
  label,
  className = "",
}: NavigationButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm sm:text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${className}`}
      aria-label={label}
    >
      {label}
    </button>
  );
}
