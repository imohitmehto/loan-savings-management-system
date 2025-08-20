"use client";

import Link from "next/link";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { FaUserEdit } from "react-icons/fa";
import { LogoutButton } from "./LogoutButton";

export const ProfileDropdown = () => {
  return (
    <div className="absolute top-12 right-0 w-48 bg-slate-800 rounded shadow-lg text-sm z-50">
      <ul className="divide-y divide-slate-700">
        <li>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 text-white"
          >
            <FiSettings /> System Settings
          </Link>
        </li>
        <li>
          <Link
            href="/profile/edit"
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 text-white"
          >
            <FaUserEdit /> Edit Profile
          </Link>
        </li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </div>
  );
};
