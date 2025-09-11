import type { Metadata } from 'next';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/globals.css';
import { Poppins } from 'next/font/google';
import { getServerSession } from 'next-auth/next';

import NavbarWrapper from '@/components/nav-bar/NavbarWrapper';
import ScrollToTop from './ScrollToTop';
import { Toaster } from 'react-hot-toast';
import SessionWrapper from './SessionWrapper';
import { nextAuthConfig } from '@/lib/auth/nextAuthConfig';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
});

/**
 * Page metadata configuration
 */
export const metadata: Metadata = {
  title: 'Sanskar Malvi Swarnkar',
};

/**
 * RootLayout wraps the app with session, auth context,
 * and UI wrappers such as navbar, toast notifications, and scroll utils.
 * Fetches session once on server-side to eliminate client-side calls on initial load.
 */
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(nextAuthConfig);

  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="font-sans antialiased bg-slate-950 text-white">
        <SessionWrapper session={session}>
          <ScrollToTop />
          <NavbarWrapper>{children}</NavbarWrapper>
          <Toaster position="top-center" />
        </SessionWrapper>
      </body>
    </html>
  );
}
