"use client";
import { useState, useEffect, useRef } from "react";
import { useProfile } from "./useProfile";
import { Avatar } from "../../ui/Avatar";
import { ProfileDropdown } from "./ProfileDropdown";

export function ProfileSection() {
  const { name, role, avatarUrl } = useProfile();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpen((prev) => !prev);
  const closeDropdown = () => setOpen(false);

  // 🔒 Close on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={toggleDropdown}
      >
        <Avatar src={avatarUrl} alt={name} />
        <div className="hidden lg:block">
          <p className="text-sm font-semibold text-white">{name || "User"}</p>
          <p className="text-xs text-slate-400">{role || "Guest"}</p>
        </div>
      </div>

      {open && <ProfileDropdown />}
    </div>
  );
}
