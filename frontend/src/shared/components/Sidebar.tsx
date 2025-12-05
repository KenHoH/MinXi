import {
  Home,
  Search,
  Plus,
  MessageSquare,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { useToast } from "../context/ToastContext";
import useNotification from "../logic/useNotificatoin";
import useGetUserConnection from "../logic/useGetUserConnection";
import { useEffect } from "react";

export function Sidebar() {
  const { user, logout } = useAuthContext();
  const { showToast } = useToast();
  const dynamicNavItems = [
    { href: "/feed", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/create", label: "Create", icon: Plus },
    { href: "/chat", label: "Chat", icon: MessageSquare },
    {
      href: user ? `/profile/${user.username}` : "/profile",
      label: "Profile",
      icon: User,
    },
  ];

  const { followings, load } = useGetUserConnection();

  const handleLogout = async () => {
    const refreshToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("refreshToken="))
      ?.split("=")[1];
    if (!user || !refreshToken) {
      showToast("Info", "You are not logged in", "error");
      return;
    }
    await logout({
      id: user.user_id,
      refreshToken: refreshToken,
    });

    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useNotification();

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-dark-900 border-r border-dark-700 flex flex-col">
      {/* Logo/Profile */}
      <div className="border-b border-dark-700 p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center shrink-0 border-2 border-burgundy-400">
            <img
              className="rounded-full"
              src={
                user?.profile_picture ||
                "http://localhost:3000/uploads/profile/1763906830326-69740177.png"
              }
              alt="Profile"
            />
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400">
              @{user?.username || "user"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2 p-3">
        {dynamicNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center justify-center w-12 h-12 rounded-lg text-gray-400 hover:bg-red-900/30 hover:text-red-400 hover:shadow-lg  transition-all duration-300"
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>
      <br />
      <br />
      <nav className="flex-1 flex flex-col gap-3 p-3 overflow-y-auto">
        {followings.map((item) => (
          <Link
            key={item.user_id}
            to={`/profile/${item.username}`}
            className="flex flex-col items-center gap-2  rounded"
            title={item.username}
          >
            <div className="relative">
              <img
                src={
                  item.profile_picture ||
                  "http://localhost:3000/uploads/profile/default.png"
                }
                alt={item.username}
                className="w-8 h-8 rounded-full "
              />
              <div className="absolute inset-0 rounded-full bg-red-500/0 group-hover:bg-red-500/10 transition-colors" />
            </div>
            <span className="text-xs text-slate-300 text-center truncate w-full max-w-[60px] group-hover:text-red-400 transition-colors">
              {item.username}
            </span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-dark-700 p-3 flex flex-col gap-2">
        <Link
          to={user ? `/settings/${user.username}` : "/login"}
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
