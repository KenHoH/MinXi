import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AUTH_MSG } from '@app/common/constants/messageEvent';
import { LoginDto } from '@app/contracts/shared-dto/auth/request/login.dto';
import { RefreshTokenRequestDto } from '@app/contracts/shared-dto/auth/request/refreshRequest.dto';
import { LogoutRequest } from '@app/contracts/shared-dto/auth/request/logout.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);
  @MessagePattern(AUTH_MSG.login)
  login(@Payload() dto: LoginDto) {
    this.logger.warn('THIS LOGIN IN SERVICE CONTROLLER');
    return this.authService.login(dto);
  }

  @MessagePattern(AUTH_MSG.refresh)
  refresh(@Payload() dto: RefreshTokenRequestDto) {
    return this.authService.refresh(dto);
  }

  @MessagePattern(AUTH_MSG.logout)
  logout(@Payload() dto: LogoutRequest) {
    return this.authService.logout(dto);
  }
}
