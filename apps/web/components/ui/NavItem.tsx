import Link from "next/link";
import { useState } from "react";

interface NavItemProps {
  item: {
    label: string;
    href: string;
    submenu?: { label: string; href: string }[];
  };
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}

export default function NavItem({
  item,
  isActive,
  onHover,
  onLeave,
}: NavItemProps) {
  return (
    <div
      className="relative group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Link href={item.href}>
        <span className="cursor-pointer hover:text-blue-400 transition">
          {item.label}
        </span>
      </Link>

      {item.submenu && isActive && (
        <div className="absolute top-full left-0 bg-white text-black rounded shadow-md mt-2 py-2 min-w-[180px] z-50">
          {item.submenu.map((sub, i) => (
            <Link
              key={i}
              href={sub.href}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
