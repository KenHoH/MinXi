import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@app/contracts/shared-dto/auth/request/login.dto';
import { RefreshTokenRequestDto } from '@app/contracts/shared-dto/auth/request/refreshRequest.dto';
import { LogoutRequest } from '@app/contracts/shared-dto/auth/request/logout.dto';
import { RpcTranslateFilter } from '@app/common/filters/rpc-translate/rpc-translate.filter';
import { JwtRefreshGuard } from '@app/common/guard/jwt-refresh-guard/jwt-refresh.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';

@Controller('auth')
@UseFilters(RpcTranslateFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.login(dto);
    response.cookie('accessToken', token.accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: 3 * 60 * 60 * 1000,
    });

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return token;
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  async refresh(
    @Body() dto: RefreshTokenRequestDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.refresh(dto);
    response.cookie('accessToken', token.accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: 3 * 60 * 60 * 1000,
    });

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return token;
  }

  @Post('/logout')
  logout(
    @Body() dto: LogoutRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie('accessToken', {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    });
    response.clearCookie('refreshToken', {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    });
    return this.authService.logout(dto);
  }
}
