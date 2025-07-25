import Link from "next/link";
import { FiGrid } from "react-icons/fi";

export function MobileMenu({
  navItems,
  openIndex,
  setOpenIndex,
  closeMobileMenu,
}) {
  return (
    <div className="fixed top-16 left-0 right-0 bg-slate-800 border-t border-slate-600/30 shadow-xl animate-in slide-in-from-top-2 duration-300">
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
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-xl text-blue-400 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <FiGrid
                      className={`transition-transform duration-200 ${openIndex === index ? "rotate-90" : ""}`}
                    />
                  </button>
                  {item.submenu && openIndex === index && (
                    <div className="ml-12 mt-2 space-y-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                      {item.submenu.length > 0 ? (
                        item.submenu.map((sub, subIdx) => (
                          <Link
                            key={subIdx}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-slate-300 hover:text-blue-400 hover:bg-slate-700/30 rounded transition-all duration-150"
                            onClick={closeMobileMenu}
                          >
                            {sub.label}
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-slate-500">
                          No subcategories
                        </div>
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
  );
}
