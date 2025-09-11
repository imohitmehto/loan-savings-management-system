'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FiLogOut } from 'react-icons/fi';

/**
 * LogoutButton handles user sign-out via next-auth.
 * Shows loading state and errors if logout fails.
 */
export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      signOut({
        redirect: true,
        callbackUrl: '/',
      });
    } catch (err) {
      setError('Logout failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleLogout}
        disabled={loading}
        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-700 text-white disabled:opacity-50 rounded transition"
        aria-disabled={loading}
      >
        <FiLogOut className="text-lg" />
        {loading ? 'Logging out...' : 'Logout'}
      </button>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
