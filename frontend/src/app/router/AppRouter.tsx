import { BrowserRouter, Route, Routes } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "../../feature/not-found/NotFoundPage";
import { ToastProvider } from "../../shared/context/ToastContext";
import { AuthProvider } from "../../feature/auth/context/AuthContext";
import { LoadingProvider } from "../../shared/context/LoadingContext";
import LoginPage from "@/feature/auth/page/LoginPage";
import RegisterPage from "@/feature/auth/page/RegisterPage";
import FeedPage from "@/feature/feed/pages/FeedPage";
import CreatePage from "@/feature/create/pages/DashboardPage";
import ProfilePage from "@/feature/profile/pages/ProfilePage";
import ChatPage from "@/feature/chat/pages/ChatPage";
import SettingsPage from "@/feature/settings/pages/SettingPage";
import SearchPage from "@/feature/search/pages/SearchPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <LoadingProvider>
          <AuthProvider>
            <Routes>
              {/* Public routes go here */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/feed/*" element={<FeedPage />}></Route>
              <Route path="/profile/:user" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />}></Route>

              <Route element={<ProtectedRoute />}>
                {/* Protected routes go here */}
                <Route path="/chat/:user" element={<ChatPage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route
                  path="/settings/:user"
                  element={<SettingsPage />}
                ></Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </LoadingProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
