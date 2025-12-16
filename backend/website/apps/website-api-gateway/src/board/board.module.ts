import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BOARD_SERVICES } from '@app/common/constants/services';
import { CommonModule } from '@app/common';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';
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
        name: BOARD_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          host: 'board-service',
          port: BOARD_SERVICES.PORT,
        },
      },
    ]),
    CommonModule,
  ],
  controllers: [BoardController],
  providers: [BoardService, JwtAuthGuard, LogInterceptor],
})
export class BoardModule {}
