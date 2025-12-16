import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionController } from './connection.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CONNECT_SERVICES } from '@app/common/constants/services';
import { CommonModule } from '@app/common';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
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
        name: CONNECT_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          host: 'connect-service',
          port: CONNECT_SERVICES.PORT,
        },
      },
    ]),
    CommonModule,
  ],
  controllers: [ConnectionController],
  providers: [ConnectionService, JwtAuthGuard, LogInterceptor],
})
export class ConnectionModule {}
