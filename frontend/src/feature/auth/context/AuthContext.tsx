import { createContext, useContext, useState } from "react";
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CredentialRes | null>(null);
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

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
    } catch (error) {
      setUser(null);
      showToast("Login failed. Please try again.");
    } finally {
      hideLoading();
    }
  };

  const logout = async (dto: LogoutRequest) => {
    showLoading();
    try {
      await AuthService.authControllerLogout(dto);
      setUser(null);
    } catch (error) {
      showToast("Logout failed. Please try again.");
    } finally {
      hideLoading();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
