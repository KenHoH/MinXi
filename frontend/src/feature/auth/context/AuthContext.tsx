import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "../../../shared/context/ToastContext";
import { useLoading } from "../../../shared/context/LoadingContext";
import type { LoginDto, LogoutRequest, UserDto } from "@/service/api";
import { AuthService, UserService } from "@/service/api";
import { useNavigate } from "react-router";

interface AuthContextType {
  user: UserDto | undefined;
  login: (dto: LoginDto) => Promise<void>;
  logout: (dto: LogoutRequest) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto>();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      const getUser = async () => {
        if (!data) return;
        await UserService.userControllerFindOneByName({
          area_id: data.area_id,
          name: data.username,
        })
          .then((res) => setUser(res))
          .catch(() => {
            showToast("Session expired. Please log in again.");
            setUser(undefined);
          });
      };
      getUser();
    } catch (error) {
      showToast("Session Not Found");
    }
  }, []);

  const login = async (dto: LoginDto): Promise<void> => {
    showLoading();
    setIsLoading(true);
    try {
      const [token, data] = await Promise.all([
        await AuthService.authControllerLogin(dto),
        await UserService.userControllerFindOneByName({
          area_id: dto.area_id,
          name: dto.username,
        }),
      ]);
      console.log("User logged in:", user);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username,
          user_id: data.user_id,
          area_id: data.area_id,
        })
      );
      setUser(data);
      showToast("Login successful!", "", "success");
      navigate("/feed");
    } catch (error: any) {
      const errorMessage =
        error?.body?.errorMessage || "Login failed. Please try again.";
      showToast(errorMessage, "", "error");
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  const logout = async (dto: LogoutRequest) => {
    showLoading();
    try {
      await AuthService.authControllerLogout(dto);
      setUser(undefined);
      showToast("Logout successful!");
    } catch (error: any) {
      const errorMessage =
        error?.body?.errorMessage || "Logout failed. Please try again.";
      showToast(errorMessage, "", "error");
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
