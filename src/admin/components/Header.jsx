import { Menu, LogOut, User } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import { useLocation } from "react-router-dom";
import { MENU_ITEMS } from "./Sidebar";

export default function Header({ onMenuOpen }) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Find page title from dynamic route
  const allItems = MENU_ITEMS.flatMap(g => g.items);
  const activeItem = allItems.find(item => item.path === location.pathname);
  const pageTitle = activeItem ? activeItem.label : "Admin Dashboard";

  return (
    <header className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuOpen}
          className="lg:hidden text-neutral-500 hover:text-neutral-900 p-1 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-md font-semibold text-neutral-900">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-500">
            <User size={16} />
            <span>{user.email}</span>
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium">
              Admin
            </span>
          </div>
        )}
        <button
          onClick={signOut}
          className="text-neutral-500 hover:text-neutral-900 p-1.5 rounded-md hover:bg-neutral-50 transition-colors flex items-center gap-2 text-sm font-medium"
          title="Sign Out"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
