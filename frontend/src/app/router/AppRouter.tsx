import { BrowserRouter, Route, Routes } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import NotFoundPage from "../../feature/not-found/NotFoundPage";
import { ToastProvider } from "../../shared/context/ToastContext";
import { AuthProvider } from "../../feature/auth/context/AuthContext";
import { LoadingProvider } from "../../shared/context/LoadingContext";
import LoginPage from "@/feature/auth/page/LoginPage";
import RegisterPage from "@/feature/auth/page/RegisterPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <LoadingProvider>
          <AuthProvider>
            <Routes>
              <Route element={<PublicRoute />}>
                {/* Public routes go here */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                {/* Protected routes go here */}
                <Route path="/profile/:id" element={<NotFoundPage />} />
                <Route path="/chat" element={<NotFoundPage />} />
                <Route path="/add" element={<NotFoundPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </LoadingProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
