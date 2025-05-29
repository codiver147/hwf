
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  UserCircle, 
  Package, 
  ClipboardList, 
  Menu,
  X,
  Tag,
  UsersRound
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

type NavItem = {
  nameKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { nameKey: "nav.dashboard", href: "/", icon: Home },
  { nameKey: "nav.clients", href: "/clients", icon: UserCircle },
  { nameKey: "nav.volunteers", href: "/volunteers", icon: Users },
  { nameKey: "nav.teams", href: "/teams", icon: UsersRound },
  { nameKey: "nav.inventory", href: "/inventory", icon: Package },
  { nameKey: "nav.categories", href: "/categories", icon: Tag },
  { nameKey: "nav.requests", href: "/requests", icon: ClipboardList },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu toggle */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed z-50 top-4 left-4 p-2 rounded-md bg-hwf-purple text-white"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {/* Logo area */}
        <div className="px-6 py-8 bg-hwf-purple text-white">
          <h1 className="text-2xl font-bold">Helping With Furniture</h1>
          <p className="text-sm opacity-80">Management System</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.nameKey}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-md group",
                      isActive
                        ? "bg-hwf-purple-light text-hwf-purple-dark"
                        : "text-gray-700 hover:bg-hwf-light"
                    )}
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5",
                        isActive ? "text-hwf-purple" : "text-gray-500"
                      )}
                    />
                    {t(item.nameKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-center text-gray-500">
            &copy; {new Date().getFullYear()} Helping With Furniture
          </p>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}
