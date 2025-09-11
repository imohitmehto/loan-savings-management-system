'use client';
import useSWR from 'swr';
import { Session } from 'next-auth';

const fetcher = async (url: string): Promise<Session> => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
};

/**
 * Custom hook for client-side session management with SWR
 * Use this when you need to manually refresh session or handle loading states
 */
export function useSessionSWR() {
  const { data, error, mutate, isLoading } = useSWR<Session>(
    '/api/auth/session',
    fetcher,
    {
      revalidateOnFocus: false, // Don't revalidate on window focus
      revalidateOnReconnect: false, // Don't revalidate on reconnect
      dedupingInterval: 5 * 60 * 1000, // 5-minute deduplication window
      errorRetryCount: 1, // Only retry once on error
      shouldRetryOnError: error => {
        return (
          !error?.message?.includes('401') && !error?.message?.includes('403')
        );
      },
    }
  );

  return {
    session: data,
    isLoading,
    isError: !!error,
    refresh: mutate,
    error,
  };
}
