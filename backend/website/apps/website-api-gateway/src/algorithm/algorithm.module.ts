import { Module } from '@nestjs/common';
import { AlgorithmService } from './algorithm.service';
import { AlgorithmController } from './algorithm.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ALGO_SERVICES } from '@app/common/constants/services';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';
import { CommonModule } from '@app/common';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ALGO_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
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
