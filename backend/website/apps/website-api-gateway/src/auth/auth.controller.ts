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
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const token = this.authService.login(dto);
    token.then((res) =>
      response.cookie('token', res, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      }),
    );

    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  refresh(
    @Body() dto: RefreshTokenRequestDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = this.authService.refresh(dto);
    token.then((res) =>
      response.cookie('token', res, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      }),
    );

    return this.authService.refresh(dto);
  }

  @Post('/logout')
  logout(@Body() dto: LogoutRequest) {
    return this.authService.logout(dto);
  }
}
