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
import { useEffect, useState } from "react";
import useUserService from "../hooks/useUserService";
import type { UserDto } from "@/service/api";
import { useSSE } from "../hooks/useSSE";

export function Sidebar() {
  const { user, logout } = useAuthContext();
  const { findOneByUsername } = useUserService();
  const { showToast } = useToast();
  const [loggedUserData, setLoggedUserData] = useState<UserDto | null>(null);
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

  const { notifications } = useSSE(
    loggedUserData?.user_id ? String(loggedUserData.user_id) : ""
  );

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

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      const userData = await findOneByUsername(user.username, user.area_id);
      setLoggedUserData(userData);
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    notifications.forEach((notification) => {
      showToast(notification.title);
    });
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(notifications[notifications.length - 1].title, {
          body: notifications[notifications.length - 1].description,
        });
      }
    });
  }, [notifications]);

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-dark-900 border-r border-dark-700 flex flex-col">
      {/* Logo/Profile */}
      <div className="border-b border-dark-700 p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center shrink-0 border-2 border-burgundy-400">
            <img
              className="rounded-full"
              src={
                loggedUserData?.profile_picture ||
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

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 p-3">
        {dynamicNavItems.map((item) => {
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
