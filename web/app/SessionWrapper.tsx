'use client';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { Session } from 'next-auth';

/**
 * SessionWrapper wraps the application with NextAuth's SessionProvider
 * with optimized settings to prevent unnecessary session fetches
 */
interface SessionWrapperProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function SessionWrapper({
  children,
  session,
}: SessionWrapperProps) {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={0}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}
