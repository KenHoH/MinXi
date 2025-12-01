import { AuthService } from "../../service/api/services/AuthService";
import type { LoginDto } from "../../service/api/models/LoginDto";
import type { TokenResponseDto } from "../../service/api/models/TokenResponseDto";
import type { RefreshTokenRequestDto } from "../../service/api/models/RefreshTokenRequestDto";
import type { LogoutRequest } from "../../service/api/models/LogoutRequest";
import type { Ack } from "../../service/api/models/Ack";
import useApiCall from "./useApiCall";

export default function useAuthService() {
  const { call, data, loading, error } = useApiCall();

  const login = (dto: LoginDto) =>
    call<TokenResponseDto>(() => AuthService.authControllerLogin(dto));

  const refresh = (dto: RefreshTokenRequestDto) =>
    call<TokenResponseDto>(() => AuthService.authControllerRefresh(dto));

  const logout = (dto: LogoutRequest) =>
    call<Ack>(() => AuthService.authControllerLogout(dto));

  return { login, refresh, logout, result: data, loading, error };
}
