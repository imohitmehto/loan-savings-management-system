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

export function SettingsSidebar({
  items,
  selectedId,
  onSelect,
}: SettingsSidebarProps) {
  return (
    <aside className="w-64 bg-white border border-gray-200 rounded-md shadow-lg h-full flex flex-col">
      <h2 className="text-2xl font-semibold px-6 py-5 border-b border-gray-300 text-gray-900 select-none">
        Settings
      </h2>
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {items.map(({ id, label, icon }) => (
            <li key={id}>
              <button
                className={`flex items-center w-full px-6 py-4 text-gray-700 hover:bg-gray-100 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  selectedId === id
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "text-gray-700"
                }`}
                onClick={() => onSelect(id)}
                aria-current={selectedId === id ? "page" : undefined}
              >
                {icon && (
                  <span className="mr-4 text-xl text-blue-500">{icon}</span>
                )}
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
