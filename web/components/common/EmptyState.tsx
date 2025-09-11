import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function EmptyState({
  message = 'No data found.',
}: {
  message?: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-gray-400"
      role="status"
      aria-live="polite"
    >
      <ExclamationCircleIcon className="h-16 w-16 mb-4" aria-hidden="true" />
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
