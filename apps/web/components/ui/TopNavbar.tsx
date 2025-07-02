"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiGrid,
  FiUser,
  FiBarChart2,
  FiHome,
  FiBell,
  FiCalendar,
} from "react-icons/fi";
import { FaMoneyBillTransfer, FaNoteSticky } from "react-icons/fa6";
import { GiPayMoney } from "react-icons/gi";
import Profile from "@/public/images/avatar.png";

interface SubmenuItem {
  label: string;
  href: string;
}

export default function TopBar() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<null | "notifications" | "calendar" | "notes">(null);
  const [accountSubmenu, setAccountSubmenu] = useState<SubmenuItem[]>([]);

  useEffect(() => {
    async function fetchSubcategories() {
      try {
        const response = await fetch("/api/account-subcategories");
        const data = await response.json();
        setAccountSubmenu(data);
      } catch (error) {
        console.error("Error fetching submenu:", error);
      }
    }
    fetchSubcategories();
  }, []);

  const navItems = [
    { label: "Home", icon: <FiHome />, href: "/home" },
    { label: "Dashboard", icon: <FiGrid />, href: "/dashboard" },
    { label: "Account", icon: <FiUser />, submenu: accountSubmenu },
    { label: "Transaction", icon: <FaMoneyBillTransfer />, href: "/transaction" },
    { label: "Loans", icon: <GiPayMoney />, href: "/loans" },
    { label: "Reports", icon: <FiBarChart2 />, href: "/reports" },
  ];

  return (
    <header className="fixed w-full bg-gray-700 text-white shadow-md z-50">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-3">
        {/* Navigation Bar */}
        <nav className="w-full md:w-auto flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 bg-gray-800 px-4 md:px-6 py-2 rounded-full overflow-x-auto">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setOpenIndex(index)}
              onMouseLeave={() => setOpenIndex(null)}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex flex-col items-center justify-center hover:text-blue-400 transition duration-150 text-xs md:text-sm whitespace-nowrap"
                >
                  <div className="text-lg md:text-xl">{item.icon}</div>
                  <span className="mt-1">{item.label}</span>
                </Link>
              ) : (
                <div className="flex flex-col items-center justify-center text-xs md:text-sm whitespace-nowrap text-white cursor-pointer">
                  <div className="text-lg md:text-xl">{item.icon}</div>
                  <span className="mt-1">{item.label}</span>
                </div>
              )}

              {/* Submenu */}
              {item.submenu && openIndex === index && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white text-black shadow-lg mt-2 py-2 rounded-md w-40 z-50">
                  {item.submenu.length > 0 ? (
                    item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className="block px-4 py-2 hover:bg-gray-100 text-sm whitespace-nowrap"
                      >
                        {subItem.label}
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">No subcategories</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Icons and Profile */}
        <div className="flex items-center gap-3 mt-3 md:mt-0">
          {/* Notification */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setDropdownOpen("notifications")}
            onMouseLeave={() => setDropdownOpen(null)}
          >
            <FiBell className="text-xl hover:text-blue-400 transition" />
            {dropdownOpen === "notifications" && (
              <div className="absolute right-0 top-full mt-2 bg-white text-black shadow-md w-56 rounded-md z-50">
                <div className="p-3 border-b text-sm font-semibold">Notifications</div>
                <ul className="text-sm">
                  <li className="px-4 py-2 hover:bg-gray-100">User A requested a loan</li>
                  <li className="px-4 py-2 hover:bg-gray-100">New account added</li>
                  <li className="px-4 py-2 hover:bg-gray-100">Monthly report ready</li>
                </ul>
              </div>
            )}
          </div>

          {/* Calendar */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setDropdownOpen("calendar")}
            onMouseLeave={() => setDropdownOpen(null)}
          >
            <FiCalendar className="text-xl hover:text-blue-400 transition" />
            {dropdownOpen === "calendar" && (
              <div className="absolute right-0 top-full mt-2 bg-white text-black shadow-md w-52 rounded-md z-50">
                <div className="p-4 text-sm">📅 Calendar view coming soon...</div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setDropdownOpen("notes")}
            onMouseLeave={() => setDropdownOpen(null)}
          >
            <FaNoteSticky className="text-xl hover:text-blue-400 transition" />
            {dropdownOpen === "notes" && (
              <div className="absolute right-0 top-full mt-2 bg-white text-black shadow-md w-64 rounded-md z-50 p-3">
                <textarea
                  className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  rows={3}
                  placeholder="Write a quick note..."
                ></textarea>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2">
            <Image
              src={Profile}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="hidden md:block text-sm text-white">Deepak Soni</span>
          </div>
        </div>
      </div>
    </header>
  );
}