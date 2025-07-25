"use client";

import React from "react";

interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SettingsSidebarProps {
  items: SidebarItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function SettingsSidebar({ items, selectedId, onSelect }: SettingsSidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-slate-200 h-full shadow-md flex flex-col">
      <h2 className="text-xl font-bold p-4 border-b border-slate-700">Settings</h2>
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {items.map(({ id, label, icon }) => (
            <li key={id}>
              <button
                className={`flex items-center w-full p-4 hover:bg-slate-800 transition-colors duration-200 focus:outline-none ${
                  selectedId === id ? "bg-slate-700 font-semibold text-white" : "text-slate-300"
                }`}
                onClick={() => onSelect(id)}
                aria-current={selectedId === id ? "page" : undefined}
              >
                {icon && <span className="mr-3 text-lg">{icon}</span>}
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
