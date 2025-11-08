import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { LoginDto } from '@app/contracts/shared-dto/auth/request/login.dto';
import { LogoutRequest } from '@app/contracts/shared-dto/auth/request/logout.dto';
import { RefreshTokenRequestDto } from '@app/contracts/shared-dto/auth/request/refreshRequest.dto';
import { TokenResponseDto } from '@app/contracts/shared-dto/auth/response/refreshResponse.dto';

export interface IAuthService {
  login(dto: LoginDto): Promise<TokenResponseDto>;
  refresh(dto: RefreshTokenRequestDto): Promise<TokenResponseDto>;
  logout(dto: LogoutRequest): Promise<Ack>;
}
