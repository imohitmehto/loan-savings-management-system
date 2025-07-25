import Link from "next/link";
import { ReactNode } from "react";

interface SubmenuItem {
  label: string;
  href: string;
}
interface NavItemProps {
  label: string;
  icon: ReactNode;
  href?: string;
  submenu?: SubmenuItem[];
  isOpen?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
  onClick?: () => void;
}

export function NavItem({
  label,
  icon,
  href,
  submenu,
  isOpen,
  onHover,
  onLeave,
  onClick,
}: NavItemProps) {
  return (
    <div
      className="relative"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {href ? (
        <Link
          href={href}
          className="group flex flex-col items-center justify-center px-3 py-2 hover:bg-slate-600/50 hover:text-blue-400 transition-all duration-200 rounded-lg text-xs whitespace-nowrap min-w-[70px]"
        >
          <div className="text-lg mb-1 group-hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
          <span className="text-[10px] font-medium">{label}</span>
        </Link>
      ) : (
        <div className="group flex flex-col items-center justify-center px-3 py-2 hover:bg-slate-600/50 hover:text-blue-400 transition-all duration-200 rounded-lg text-xs whitespace-nowrap cursor-pointer min-w-[70px]">
          <div className="text-lg mb-1 group-hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
          <span className="text-[10px] font-medium">{label}</span>
        </div>
      )}
      {submenu && isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white text-slate-800 shadow-xl mt-2 py-2 rounded-xl w-48 z-50 border border-slate-200 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-l border-t border-slate-200"></div>
          {submenu.length > 0 ? (
            submenu.map((sub, idx) => (
              <Link
                key={idx}
                href={sub.href}
                className="block px-4 py-2.5 hover:bg-slate-50 text-sm font-medium transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
              >
                {sub.label}
              </Link>
            ))
          ) : (
            <div className="px-4 py-2.5 text-sm text-slate-500">No subcategories</div>
          )}
        </div>
      )}
    </div>
  );
}
