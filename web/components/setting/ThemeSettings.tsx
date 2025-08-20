// "use client";

// import { useEffect, useState } from "react";

// export default function ThemeSettings() {
//   const [theme, setTheme] = useState<"light" | "dark">("light");

//   // Initialize theme from localStorage or system preference
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
//     if (savedTheme) {
//       setTheme(savedTheme);
//       updateHtmlClass(savedTheme);
//     } else {
//       const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//       setTheme(prefersDark ? "dark" : "light");
//       updateHtmlClass(prefersDark ? "dark" : "light");
//     }
//   }, []);

//   // Update <html> class and localStorage when theme changes
//   useEffect(() => {
//     updateHtmlClass(theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   function updateHtmlClass(theme: "light" | "dark") {
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }

//   // Toggle between light and dark mode
//   function toggleTheme() {
//     setTheme((prev) => (prev === "dark" ? "light" : "dark"));
//   }

//   return (
//     <button
//       onClick={toggleTheme}
//       aria-label="Toggle dark mode"
//       className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 dark:text-white transition"
//     >
//       Switch to {theme === "dark" ? "Light" : "Dark"} Mode
//     </button>
//   );
// }
