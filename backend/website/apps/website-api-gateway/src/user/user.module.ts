import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICES } from '@app/common/constants/services';
import { AuthModule } from '@app/common/guard/auth.module';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { AdminGuard } from '@app/common/guard/admin/admin.guard';
import { CommonModule } from '@app/common';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';
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
        name: USER_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: { host: 'user-service', port: USER_SERVICES.PORT },
      },
    ]),
    AuthModule,
    CommonModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard, AdminGuard, LogInterceptor],
})
export class UserModule {}
