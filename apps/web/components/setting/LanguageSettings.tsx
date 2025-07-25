"use client";

import React, { useState } from "react";

const languages = ["English", "Hindi", "Gujarati", "Spanish", "French"];

export default function LanguageSettings() {
  const [selectedLang, setSelectedLang] = useState("English");

  return (
    <section className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Language Settings</h3>
      <label htmlFor="language-select" className="block mb-2 font-medium">
        Select your preferred language:
      </label>
      <select
        id="language-select"
        value={selectedLang}
        onChange={(e) => setSelectedLang(e.target.value)}
        className="p-2 rounded-md bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <p className="mt-4 text-slate-300">Current language: <strong>{selectedLang}</strong></p>
    </section>
  );
}
