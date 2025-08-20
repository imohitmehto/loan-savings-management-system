"use client";

import { useEffect, useState, ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_KEY = "theme";

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  // Load theme preference from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as
      | "light"
      | "dark"
      | null;
    if (savedTheme) {
      setTheme(savedTheme);
      updateHtmlClass(savedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
      updateHtmlClass(prefersDark ? "dark" : "light");
    }
  }, []);

  // Update <html> class and localStorage when theme state changes
  useEffect(() => {
    if (theme) {
      updateHtmlClass(theme);
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  // Add or remove `dark` class on <html>
  function updateHtmlClass(theme: "light" | "dark") {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  // Toggle between light and dark
  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  // Until theme is loaded, avoid rendering children (prevents mismatch)
  if (!theme) return null;

  return (
    <>
      {/* Toggle button rendered here or you can expose toggleTheme to context */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 px-4 py-2 border rounded bg-gray-200 dark:bg-gray-800 dark:text-white transition"
        aria-label="Toggle dark mode"
      >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
      {children}
    </>
  );
}
