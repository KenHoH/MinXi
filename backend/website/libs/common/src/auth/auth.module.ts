import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth-guard/jwt-auth.guard';
import { JwtStrategy } from './jwt-strategy/jwt-strategy';
import { JwtRefresh } from './jwt-refresh/jwt-refresh';
import { JwtRefreshGuard } from './jwt-refresh-guard/jwt-refresh.guard';
import { ConfigModule } from '@nestjs/config';

import * as dotenv from 'dotenv';
import { AdminGuard } from './admin/admin.guard';
import { JwtModule } from '@nestjs/jwt';

dotenv.config({ path: './libs/common/src/auth/.env' });
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'access' }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './libs/common/src/auth/.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    JwtRefresh,
    JwtRefreshGuard,
    AdminGuard,
  ],
  exports: [PassportModule, JwtAuthGuard, JwtRefreshGuard, AdminGuard],
})
export class AuthModule {}
