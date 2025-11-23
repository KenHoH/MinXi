import { createContext, useContext, useState, useEffect } from "react";
import {
  AuthService,
  UserService,
  type CredentialRes,
  type LoginDto,
  type LogoutRequest,
} from "../../../services/api";
import { useToast } from "../../../shared/context/ToastContext";
import { useLoading } from "../../../shared/context/LoadingContext";

interface AuthContextType {
  user: CredentialRes | null;
  login: (dto: LoginDto) => Promise<void>;
  logout: (dto: LogoutRequest) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CredentialRes | null>(null);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const { showLoading, hideLoading } = useLoading();

  const getUserData = () => {
    try {
      const userDataCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user="))
        ?.split("=")[1];

      if (userDataCookie) {
        console.log("the user data cookie ", userDataCookie);
        const userData: CredentialRes = JSON.parse(
          decodeURIComponent(userDataCookie)
        );
        console.log(userData);
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to restore user from cookie:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const login = async (dto: LoginDto) => {
    showLoading();
    try {
      await AuthService.authControllerLogin(dto);
      const userData: CredentialRes =
        await UserService.userControllerFindByName({
          area_id: dto.area_id,
          name: dto.username,
        });
      setUser(userData);
      showToast("Login successful!");
    } catch (error: any) {
      setUser(null);
      const errorMessage =
        error?.body?.errorMessage || "Login failed. Please try again.";
      showToast(errorMessage);
    } finally {
      hideLoading();
    }
  };

  const logout = async (dto: LogoutRequest) => {
    showLoading();
    try {
      await AuthService.authControllerLogout(dto);
      setUser(null);
      showToast("Logout successful!");
    } catch (error: any) {
      const errorMessage =
        error?.body?.errorMessage || "Logout failed. Please try again.";
      showToast(errorMessage);
    } finally {
      hideLoading();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
