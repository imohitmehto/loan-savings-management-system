"use client";

import { JSX, ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import TopBar from "@/components/nav-bar/TopBar";

// Define routes where the navbar should be hidden (e.g., auth pages)
const HIDDEN_NAVBAR_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/otp",
];

interface NavbarWrapperProps {
  children: ReactNode;
}

/**
 * NavbarWrapper handles conditional rendering of TopBar and
 * applies layout spacing to avoid content overlap.
 *
 * @param children - The page content to be wrapped beneath the navbar.
 * @returns JSX.Element
 */
export default function NavbarWrapper({
  children,
}: NavbarWrapperProps): JSX.Element {
  const pathname = usePathname();

  // Memoize navbar visibility check based on current route
  const showNavbar = useMemo(
    () => !HIDDEN_NAVBAR_ROUTES.includes(pathname),
    [pathname],
  );

  return (
    <>
      {showNavbar && <TopBar />}
      {/* Apply padding to offset navbar height (e.g., 64px) */}
      <main className={`px-4 ${showNavbar ? "pt-16" : "pt-4"}`}>
        {children}
      </main>
    </>
  );
}
