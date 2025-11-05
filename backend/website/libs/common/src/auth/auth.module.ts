import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth-guard/jwt-auth.guard';
import { JwtStrategy } from './jwt-strategy/jwt-strategy';
import { JwtRefresh } from './jwt-refresh/jwt-refresh';
import { JwtRefreshGuard } from './jwt-refresh-guard/jwt-refresh.guard';
import { ConfigModule } from '@nestjs/config';

import * as dotenv from 'dotenv';

dotenv.config({ path: './libs/common/src/auth/.env' });
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'access' }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './libs/common/src/auth/.env',
    }),
  ],
  providers: [JwtStrategy, JwtAuthGuard, JwtRefresh, JwtRefreshGuard],
  exports: [PassportModule, JwtAuthGuard, JwtRefreshGuard],
})
export class AuthModule {}
