import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from '@app/common/interfaces/auth/IAuthService';
import { LoginDto } from '@app/contracts/shared-dto/auth/request/login.dto';
import { TokenResponseDto } from '@app/contracts/shared-dto/auth/response/refreshResponse.dto';
import { RefreshTokenRequestDto } from '@app/contracts/shared-dto/auth/request/refreshRequest.dto';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { LogoutRequest } from '@app/contracts/shared-dto/auth/request/logout.dto';
import { JwtService } from '@nestjs/jwt';
import { USER_SERVICES } from '@app/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USER_MSG } from '@app/common/constants/messageEvent';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_SERVICES.CLIENT) private userClient: ClientProxy,
    jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<TokenResponseDto> {
    // const user = await firstValueFrom(this.userClient.send(USER_MSG.findOne));
    return {
      accessToken: 'testing',
      expiresIn: 100,
      refreshToken: 'testing',
    };
  }
  async refresh(dto: RefreshTokenRequestDto): Promise<TokenResponseDto> {
    return {
      accessToken: 'testing',
      expiresIn: 100,
      refreshToken: 'testing',
    };
  }
  async logout(dto: LogoutRequest): Promise<Ack> {
    return {
      Msg: 'Testing',
      Valid: false,
    };
  }
}
