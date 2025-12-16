import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth-guard/jwt-auth.guard';
import { JwtStrategy } from './jwt-strategy/jwt-strategy';
import { JwtRefresh } from './jwt-refresh/jwt-refresh';
import { JwtRefreshGuard } from './jwt-refresh-guard/jwt-refresh.guard';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { AdminGuard } from './admin/admin.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'access' }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true, // IMPORTANT
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '60s',
        },
      }),
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
