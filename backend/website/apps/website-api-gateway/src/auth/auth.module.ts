import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICES } from '@app/common/constants/services';
import { AuthModule as AuthModuleCommon } from '@app/common/guard/auth.module';
import { JwtRefreshGuard } from '@app/common/guard/jwt-refresh-guard/jwt-refresh.guard';
import { CommonModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined');
        }

        return {
          secret,
          signOptions: {
            expiresIn: '60s',
          },
        };
      },
    }),
    ClientsModule.register([
      {
        name: AUTH_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: { host: 'auth-service', port: AUTH_SERVICES.PORT },
      },
    ]),
    AuthModuleCommon,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtRefreshGuard],
})
export class AuthModule {}
