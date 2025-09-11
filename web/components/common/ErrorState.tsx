import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

type ErrorStateProps = {
  message: string;
  className?: string;
};

export default function ErrorState({ message, className }: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 bg-red-50 rounded-xl ${className ?? ''}`}
    >
      <FiAlertCircle className="text-red-500 text-4xl mb-2" />
      <span className="font-semibold text-red-700">{message}</span>
    </div>
  );
}
