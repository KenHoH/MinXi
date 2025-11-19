import { Module } from '@nestjs/common';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';
import { CommonModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SOCIAL_SERVICES } from '@app/common/constants/services';

@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      {
        name: SOCIAL_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: SOCIAL_SERVICES.PORT,
        },
      },
    ]),
  ],
  controllers: [SseController],
  providers: [SseService],
})
export class SseModule {}
