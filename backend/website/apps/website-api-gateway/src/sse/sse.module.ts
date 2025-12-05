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

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SOCIAL_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: SOCIAL_SERVICES.PORT,
        },
      },
      {
        name: NOTIF_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: NOTIF_SERVICES.PORT,
        },
      },
      {
        name: USER_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
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
