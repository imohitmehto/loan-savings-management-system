"use client";

import LanguageSettings from "@/components/setting/LanguageSettings";
import { SettingsSidebar } from "@/components/setting/SettingsSidebar";
// import ThemeSettings from "@/components/setting/ThemeSettings";
import UserManagement from "@/components/setting/UserManagement";
import { useState } from "react";

import { FiGlobe, FiMoon, FiUsers } from "react-icons/fi";
import { PageLayout } from "@/components/common/layout/index"; // Import your PageLayout component

const sidebarItems = [
  { id: "language", label: "Language", icon: <FiGlobe /> },
  // { id: "theme", label: "Theme", icon: <FiMoon /> },
  { id: "userManagement", label: "User Management", icon: <FiUsers /> },
  // You can add more options here like "Privacy", "Notifications", etc.
];

export default function SettingsPage() {
  const [selectedSetting, setSelectedSetting] = useState<string>("language");

  // Helper to render based on selected tab
  function renderSelectedSetting() {
    switch (selectedSetting) {
      case "language":
        return <LanguageSettings />;
      // case "theme":
      //   return <ThemeSettings />;
      case "userManagement":
        return <UserManagement />;
      default:
        return <p className="p-6">Select a setting from the sidebar</p>;
    }
  }

  return (
    <PageLayout>
      <div className="min-h-screen flex bg-slate-900 text-slate-200 rounded-md shadow-lg overflow-hidden">
        <SettingsSidebar
          items={sidebarItems}
          selectedId={selectedSetting}
          onSelect={setSelectedSetting}
        />
        <main className="flex-1 bg-slate-800 p-6 overflow-auto">
          {renderSelectedSetting()}
        </main>
      </div>
    </PageLayout>
  );
}
