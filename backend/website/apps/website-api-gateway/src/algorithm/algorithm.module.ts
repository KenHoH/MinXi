import { Module } from '@nestjs/common';
import { AlgorithmService } from './algorithm.service';
import { AlgorithmController } from './algorithm.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ALGO_SERVICES } from '@app/common/constants/services';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';
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
        name: ALGO_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          host: 'algo-service',
          port: ALGO_SERVICES.PORT,
        },
      },
    ]),
    CommonModule,
  ],
  controllers: [AlgorithmController],
  providers: [AlgorithmService, JwtAuthGuard, LogInterceptor],
})
export class AlgorithmModule {}
