import { Module } from '@nestjs/common';
import { AlgorithmService } from './algorithm.service';
import { AlgorithmController } from './algorithm.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  CONTENT_SERVICES,
  HISTORY_SERVICES,
} from '@app/common/constants/services';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: CONTENT_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: CONTENT_SERVICES.PORT,
        },
      },
      {
        name: HISTORY_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: HISTORY_SERVICES.PORT,
        },
      },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AlgorithmController],
  providers: [AlgorithmService],
})
export class AlgorithmModule {}
