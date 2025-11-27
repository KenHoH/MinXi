import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../feature/auth/context/AuthContext";

export default function PublicRoute() {
  const { user } = useAuthContext();
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}
