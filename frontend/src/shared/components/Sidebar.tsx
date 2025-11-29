import {
  Home,
  Search,
  Plus,
  MessageSquare,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { cn } from "@/lib/utils";
import { useToast } from "../context/ToastContext";

const navItems = [
  { href: "/feed", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/create", label: "Create", icon: Plus },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const { user, logout } = useAuthContext();
  const { showToast } = useToast();
  const handleLogout = async () => {
    const refreshToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("refreshToken="))
      ?.split("=")[1];
    if (!user || !refreshToken) {
      showToast("You are not logged in");
      return;
    }
    await logout({
      id: user.user_id,
      refreshToken: refreshToken,
    });
    window.location.href = "/login";
  };

  const userInitials =
    user?.username
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-dark-900 border-r border-dark-700 flex flex-col">
      {/* Logo/Profile */}
      <div className="border-b border-dark-700 p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center shrink-0 border-2 border-burgundy-400">
            <span className="text-white text-xs font-bold">{userInitials}</span>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400">
              @{user?.username || "user"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center justify-center w-12 h-12 rounded-lg text-gray-400 hover:bg-red-900/30 hover:text-red-400 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300"
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-dark-700 p-3 flex flex-col gap-2">
        <Link
          to="/settings"
          className="flex items-center justify-center w-12 h-12 rounded-lg text-gray-400 hover:bg-red-900/30 hover:text-red-400 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-12 h-12 rounded-lg text-gray-400 hover:bg-red-900/30 hover:text-red-400 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
