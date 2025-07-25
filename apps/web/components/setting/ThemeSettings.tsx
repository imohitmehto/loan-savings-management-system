"use client";

import React, { useState, useEffect } from "react";

const themes = ["Light", "Dark", "System"];

export default function ThemeSettings() {
  const [selectedTheme, setSelectedTheme] = useState<string>("System");

  useEffect(() => {
    // You can integrate theme switching here (e.g., with Tailwind dark mode)
  }, [selectedTheme]);

  return (
    <section className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Theme Settings</h3>
      <fieldset className="space-y-2">
        <legend className="sr-only">Select Theme</legend>
        {themes.map((theme) => (
          <label key={theme} className="inline-flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value={theme}
              checked={selectedTheme === theme}
              onChange={() => setSelectedTheme(theme)}
              className="form-radio text-blue-400"
            />
            <span>{theme}</span>
          </label>
        ))}
      </fieldset>
      <p className="mt-4 text-slate-300">Current theme: <strong>{selectedTheme}</strong></p>
    </section>
  );
}
