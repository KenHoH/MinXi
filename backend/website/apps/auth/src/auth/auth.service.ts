import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
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
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { httpToRpc } from '@app/common/utils/httpToRpc';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_SERVICES.CLIENT) private userClient: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  private async generateToken(
    payload: any,
    secret: string,
    expiresIn: number,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  async login(dto: LoginDto): Promise<TokenResponseDto> {
    const user = await firstValueFrom(
      this.userClient.send(USER_MSG.findByName, { name: dto.username }),
    );

    if (!user) throw httpToRpc(new UnauthorizedException('User not found'));

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid)
      throw httpToRpc(new UnauthorizedException('Invalid credentials'));

    this.logger.warn(user.user_id);
    this.logger.warn(user.username);
    const payload = { sub: user.userId, username: user.username };

    const accessSecret = this.configService.get<string>('JWT_SECRET')!;
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET')!;

    const accessToken = await this.generateToken(payload, accessSecret, 900000);
    const refreshToken = await this.generateToken(
      payload,
      refreshSecret,
      604800000,
    );

    this.logger.warn(user);
    const refreshTtl = 7 * 24 * 60 * 60; // 7 days
    await this.cacheManager.set(
      `refresh_${user.userId}`,
      refreshToken,
      refreshTtl,
    );

    this.logger.debug(`User ${user.username} logged in`);
    this.logger.debug(`User ${refreshToken} refresh token`);

    return {
      accessToken,
      refreshToken,
    };
  }
  async refresh(dto: RefreshTokenRequestDto): Promise<TokenResponseDto> {
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    try {
      const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: refreshSecret,
      });

      const cachedToken = await this.cacheManager.get<string>(
        `refresh_${payload.sub}`,
      );

      if (!cachedToken || cachedToken !== dto.refreshToken) {
        throw httpToRpc(
          new UnauthorizedException('Invalid or expired refresh token'),
        );
      }

      const newAccessToken = await this.generateToken(
        { sub: payload.sub, username: payload.username },
        this.configService.get<string>('JWT_SECRET')!,
        900000,
      );

      return {
        accessToken: newAccessToken,
        refreshToken: dto.refreshToken,
      };
    } catch (error) {
      throw httpToRpc(
        new UnauthorizedException('Invalid or expired refresh token'),
      );
    }
  }
  async logout(dto: LogoutRequest): Promise<Ack> {
    const deleted = await this.cacheManager.del(`refresh_${dto.id}`);
    this.logger.debug(`Deleted key: refresh_${dto.id} result: ${deleted}`);

    return {
      Msg: 'Logout successful',
      Valid: true,
    };
  }
}
