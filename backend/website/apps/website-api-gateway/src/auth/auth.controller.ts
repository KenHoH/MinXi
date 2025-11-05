import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@app/contracts/shared-dto/auth/request/login.dto';
import { RefreshTokenRequestDto } from '@app/contracts/shared-dto/auth/request/refreshRequest.dto';
import { LogoutRequest } from '@app/contracts/shared-dto/auth/request/logout.dto';
import { RpcTranslateFilter } from '@app/common/filters/rpc-translate/rpc-translate.filter';

@Controller('auth')
@UseFilters(RpcTranslateFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('/refresh')
  refresh(@Body() dto: RefreshTokenRequestDto) {
    return this.authService.refresh(dto);
  }

  @Post('/logout')
  logout(@Body() dto: LogoutRequest) {
    return this.authService.logout(dto);
  }
}
