import { Module } from '@nestjs/common';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  NOTIF_SERVICES,
  SOCIAL_SERVICES,
  SSE_SERVICES,
  USER_SERVICES,
} from '@app/common/constants/services';
import { CommonModule } from '@app/common';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
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
        name: SOCIAL_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          host: 'social-service',
          port: SOCIAL_SERVICES.PORT,
        },
      },
      {
        name: NOTIF_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          host: 'notif-service',
          port: NOTIF_SERVICES.PORT,
        },
      },
      {
        name: USER_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          host: 'user-service',
          port: USER_SERVICES.PORT,
        },
      },
    ]),
    CommonModule,
  ],
  controllers: [SseController],
  providers: [SseService, JwtAuthGuard],
})
export class SseModule {}
