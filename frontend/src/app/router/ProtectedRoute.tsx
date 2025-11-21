import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../feature/auth/context/AuthContext";

export default function ProtectedRoute() {
  const { user } = useAuthContext();
  if (!user) {
    console.log(user);
    return <Navigate to="/login" replace></Navigate>;
  }
  return <Outlet />;
}
