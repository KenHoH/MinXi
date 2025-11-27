import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../feature/auth/context/AuthContext";

export default function ProtectedRoute() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace></Navigate>;
  }
  return <Outlet />;
}
