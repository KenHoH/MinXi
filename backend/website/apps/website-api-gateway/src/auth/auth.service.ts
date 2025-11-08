import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IAuthService } from '@app/contracts/interfaces/auth/IAuthService';
import { LoginDto } from '@app/contracts/shared-dto/auth/request/login.dto';
import { TokenResponseDto } from '@app/contracts/shared-dto/auth/response/refreshResponse.dto';
import { RefreshTokenRequestDto } from '@app/contracts/shared-dto/auth/request/refreshRequest.dto';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { LogoutRequest } from '@app/contracts/shared-dto/auth/request/logout.dto';
import { AUTH_SERVICES } from '@app/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_MSG } from '@app/common/constants/messageEvent';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(@Inject(AUTH_SERVICES.CLIENT) private authClient: ClientProxy) {}

  async login(dto: LoginDto): Promise<TokenResponseDto> {
    this.logger.warn('Testing IN LOGIN');
    return await firstValueFrom(this.authClient.send(AUTH_MSG.login, dto));
  }
  async refresh(dto: RefreshTokenRequestDto): Promise<TokenResponseDto> {
    return await firstValueFrom(this.authClient.send(AUTH_MSG.refresh, dto));
  }
  async logout(dto: LogoutRequest): Promise<Ack> {
    return await firstValueFrom(this.authClient.send(AUTH_MSG.logout, dto));
  }
}
