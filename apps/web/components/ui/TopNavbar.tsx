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
  FiMenu,
  FiX,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Define submenu items for each dropdown
  const transactionSubmenu: SubmenuItem[] = [
    { label: "New Transaction", href: "/transaction/new" },
    { label: "Transaction History", href: "/transaction/history" },
    { label: "Pending Transactions", href: "/transaction/pending" },
    { label: "Failed Transactions", href: "/transaction/failed" },
    { label: "Transaction Categories", href: "/transaction/categories" },
  ];

  const loanSubmenu: SubmenuItem[] = [
    { label: "Apply for Loan", href: "/loans/apply" },
    { label: "Active Loans", href: "/loans/active" },
    { label: "Loan History", href: "/loans/history" },
    { label: "Loan Calculator", href: "/loans/calculator" },
    { label: "Loan Documents", href: "/loans/documents" },
  ];

  const reportsSubmenu: SubmenuItem[] = [
    { label: "Financial Reports", href: "/reports/financial" },
    { label: "Transaction Reports", href: "/reports/transactions" },
    { label: "Loan Reports", href: "/reports/loans" },
    { label: "Monthly Summary", href: "/reports/monthly" },
    { label: "Annual Reports", href: "/reports/annual" },
    { label: "Custom Reports", href: "/reports/custom" },
  ];

  const navItems = [
    { label: "Home", icon: <FiHome />, href: "/home" },
    { label: "Dashboard", icon: <FiGrid />, href: "/dashboard" },
    { label: "Account", icon: <FiUser />, submenu: accountSubmenu },
    { label: "Transaction", icon: <FaMoneyBillTransfer />, submenu: transactionSubmenu },
    { label: "Loans", icon: <GiPayMoney />, submenu: loanSubmenu },
    { label: "Reports", icon: <FiBarChart2 />, submenu: reportsSubmenu },
  ];

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed py-1 w-full bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white shadow-2xl z-50 backdrop-blur-md border-b border-slate-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">



            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 bg-slate-700/50 backdrop-blur-sm px-4 rounded-full border border-slate-600/30">
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
                      className="group flex flex-col items-center justify-center px-3 py-2 hover:bg-slate-600/50 hover:text-blue-400 transition-all duration-200 rounded-lg text-xs whitespace-nowrap min-w-[70px]"
                    >
                      <div className="text-lg mb-1 group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                  ) : (
                    <div className="group flex flex-col items-center justify-center px-3 py-2 hover:bg-slate-600/50 hover:text-blue-400 transition-all duration-200 rounded-lg text-xs whitespace-nowrap cursor-pointer min-w-[70px]">
                      <div className="text-lg mb-1 group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </div>
                  )}

                  {/* Desktop Submenu */}
                  {item.submenu && openIndex === index && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white text-slate-800 shadow-xl mt-2 py-2 rounded-xl w-48 z-50 border border-slate-200 animate-in fade-in-0 zoom-in-95 duration-200">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-l border-t border-slate-200"></div>
                      {item.submenu.length > 0 ? (
                        item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className="block px-4 py-2.5 hover:bg-slate-50 text-sm font-medium transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                          >
                            {subItem.label}
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-2.5 text-sm text-slate-500">No subcategories</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              onClick={handleMobileMenuToggle}
            >
              {mobileMenuOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>

            {/* Right Section - Icons and Profile */}
            <div className="flex items-center space-x-3">



              {/* Desktop Icons */}
              <div className="flex items-center space-x-2">

                {/* Notifications */}
                <div
                  className="relative"
                  onMouseEnter={() => setDropdownOpen("notifications")}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <button className="relative p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200 group">
                    <FiBell className="text-lg group-hover:text-blue-400 transition-colors duration-200" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">3</span>
                    </div>
                  </button>

                  {dropdownOpen === "notifications" && (
                    <div className="absolute right-0 top-full mt-2 bg-white text-slate-800 shadow-xl w-80 rounded-xl z-50 border border-slate-200 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-800">Notifications</h3>
                        <p className="text-xs text-slate-500 mt-1">You have 3 unread notifications</p>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="p-3 hover:bg-slate-50 transition-colors border-l-4 border-blue-400">
                          <p className="text-sm font-medium">User A requested a loan</p>
                          <p className="text-xs text-slate-500 mt-1">2 minutes ago</p>
                        </div>
                        <div className="p-3 hover:bg-slate-50 transition-colors border-l-4 border-green-400">
                          <p className="text-sm font-medium">New account added</p>
                          <p className="text-xs text-slate-500 mt-1">1 hour ago</p>
                        </div>
                        <div className="p-3 hover:bg-slate-50 transition-colors border-l-4 border-purple-400">
                          <p className="text-sm font-medium">Monthly report ready</p>
                          <p className="text-xs text-slate-500 mt-1">3 hours ago</p>
                        </div>
                      </div>
                      <div className="p-3 border-t border-slate-100">
                        <button className="text-xs text-blue-500 font-medium hover:text-blue-600 transition-colors">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Calendar */}
                <div
                  className="relative"
                  onMouseEnter={() => setDropdownOpen("calendar")}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200 group">
                    <FiCalendar className="text-lg group-hover:text-blue-400 transition-colors duration-200" />
                  </button>

                  {dropdownOpen === "calendar" && (
                    <div className="absolute right-0 top-full mt-2 bg-white text-slate-800 shadow-xl w-64 rounded-xl z-50 border border-slate-200 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                      <div className="p-4 text-center">
                        <FiCalendar className="text-3xl text-slate-400 mx-auto mb-2" />
                        <p className="text-sm font-medium">Calendar Integration</p>
                        <p className="text-xs text-slate-500 mt-1">Coming soon...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div
                  className="relative"
                  onMouseEnter={() => setDropdownOpen("notes")}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200 group">
                    <FaNoteSticky className="text-lg group-hover:text-blue-400 transition-colors duration-200" />
                  </button>

                  {dropdownOpen === "notes" && (
                    <div className="absolute right-0 top-full mt-2 bg-white text-slate-800 shadow-xl w-80 rounded-xl z-50 border border-slate-200 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-800 mb-3">Quick Notes</h3>
                        <textarea
                          className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                          rows={4}
                          placeholder="Write a quick note..."
                        ></textarea>
                        <div className="flex justify-end mt-3">
                          <button className="px-4 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors">
                            Save Note
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile */}
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-600/50">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Image
                      src={Profile}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-slate-600/50 hover:border-blue-400 transition-colors duration-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-slate-800 rounded-full"></div>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-white">Deepak Soni</p>
                    <p className="text-xs text-slate-400">Administrator</p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          ></div>

          {/* Mobile Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bg-slate-800 border-t border-slate-600/30 shadow-xl animate-in slide-in-from-top-2 duration-300">

            {/* Mobile Navigation */}
            <nav className="px-4 py-6">
              <div className="space-y-2 text-white">
                {navItems.map((item, index) => (
                  <div key={index}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex items-center space-x-4 px-4 py-3 hover:bg-slate-700/50 rounded-lg transition-all duration-200 group"
                        onClick={closeMobileMenu}
                      >
                        <div className="text-xl text-blue-400 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ) : (
                      <div>
                        <button
                          className="flex items-center justify-between w-full px-4 py-3 hover:bg-slate-700/50 rounded-lg transition-all duration-200 group"
                          onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="text-xl text-blue-400 group-hover:scale-110 transition-transform">
                              {item.icon}
                            </div>
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <FiGrid className={`transition-transform duration-200 ${openIndex === index ? 'rotate-90' : ''}`} />
                        </button>

                        {/* Mobile Submenu */}
                        {item.submenu && openIndex === index && (
                          <div className="ml-12 mt-2 space-y-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                            {item.submenu.length > 0 ? (
                              item.submenu.map((subItem, subIndex) => (
                                <Link
                                  key={subIndex}
                                  href={subItem.href}
                                  className="block px-4 py-2 text-sm text-slate-300 hover:text-blue-400 hover:bg-slate-700/30 rounded transition-all duration-150"
                                  onClick={closeMobileMenu}
                                >
                                  {subItem.label}
                                </Link>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-sm text-slate-500">No subcategories</div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}