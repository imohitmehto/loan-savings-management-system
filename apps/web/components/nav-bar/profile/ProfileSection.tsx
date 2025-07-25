"use client";
import { useState } from "react";
import { useProfile } from "./useProfile";
import { Avatar } from "../../ui/Avatar";
import { ProfileDropdown } from "./ProfileDropdown";

export function ProfileSection() {
  const { name, role, avatarUrl } = useProfile();
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen(!open);
  const closeDropdown = () => setOpen(false);

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
        <Avatar src={avatarUrl} alt={name} />
        <div className="hidden lg:block">
          <p className="text-sm font-semibold text-white">{name || "User"}</p>
          <p className="text-xs text-slate-400">{role || "Guest"}</p>
        </div>
      </div>
      {open && <ProfileDropdown />}
      {/* Optional: close dropdown on outside click or ESC key */}
    </div>
  );
}