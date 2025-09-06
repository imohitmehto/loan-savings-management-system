"use client";
import { useEffect, useState, useCallback } from "react";
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
import { NavItem } from "./NavItems";
import { ProfileSection } from "./profile/ProfileSection";
import { NotificationsDropdown, NotesDropdown } from "./dropdown/Dropdowns";
import CalendarDropdown from "./dropdown/CalendarDropdown";
import { MobileMenu } from "./MobileMenu";

export default function TopBar() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<
    null | "notifications" | "calendar" | "notes"
  >(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /** Responsive device check (runs client-side only) */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /** Menu items config */
  const submenus = {
    account: [
      { label: "All Accounts", href: "/account" },
      { label: "New Account", href: "/account/new" },
      { label: "All Account Groups", href: "/account/group" },
      { label: "New Account Group", href: "/account/group/new" },
    ],
    transaction: [
      { label: "All Transactions", href: "/transaction" },
      { label: "New Transaction", href: "/transaction/new" },
      { label: "All Expenses", href: "/transaction/expenses" },
      { label: "All Monthly Pending", href: "/transaction/monthly-pending" },
    ],
    loan: [
      { label: "All Loans", href: "/loans" },
      { label: "Apply for Loan", href: "/loans/apply" },
      { label: "All Loan Policies", href: "/loans/policies" },
      { label: "New Loan Policy", href: "/loans/policies/new" },
      { label: "Loan Calculator", href: "/loans/calculator" },
    ],
    reports: [
      { label: "Financial Reports", href: "/reports" },
      { label: "Transaction Reports", href: "/reports/" },
      { label: "Loan Reports", href: "/reports/loans" },
      { label: "Monthly Summary", href: "/reports/monthly" },
      { label: "Annual Reports", href: "/reports/annual" },
      { label: "Custom Reports", href: "/reports/custom" },
    ],
  };

  const navItems = [
    { label: "Home", icon: <FiHome />, href: "/home" },
    { label: "Dashboard", icon: <FiGrid />, href: "/dashboard" },
    { label: "Account", icon: <FiUser />, submenu: submenus.account },
    {
      label: "Transaction",
      icon: <FaMoneyBillTransfer />,
      submenu: submenus.transaction,
    },
    { label: "Loans", icon: <GiPayMoney />, submenu: submenus.loan },
    { label: "Reports", icon: <FiBarChart2 />, submenu: submenus.reports },
  ];

  /** Mobile menu handlers */
  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen((v) => !v);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* Top bar */}
      <header className="fixed py-1 w-full bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white shadow-2xl z-50 backdrop-blur-md border-b border-slate-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-1 bg-slate-700/50 backdrop-blur-sm px-4 rounded-full border border-slate-600/30">
              {navItems.map((item, index) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenIndex(index)}
                  onMouseLeave={() => setOpenIndex(null)}
                >
                  <NavItem
                    label={item.label}
                    icon={item.icon}
                    href={item.href}
                    submenu={item.submenu}
                    isOpen={openIndex === index}
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                  />
                </div>
              ))}
            </nav>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              onClick={handleMobileMenuToggle}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>

            {/* Right side widgets */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2">
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
                    <NotificationsDropdown />
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
                  {dropdownOpen === "calendar" && <CalendarDropdown />}
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
                  {dropdownOpen === "notes" && <NotesDropdown />}
                </div>
              </div>
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-600/50">
                <ProfileSection />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && isMobile && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={closeMobileMenu}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
          <MobileMenu
            navItems={navItems}
            openIndex={openIndex}
            setOpenIndex={setOpenIndex}
            closeMobileMenu={closeMobileMenu}
          />
        </div>
      )}
    </>
  );
}
