import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIF_SERVICES } from '@app/common/constants/services';
import { CommonModule } from '@app/common';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NOTIF_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: NOTIF_SERVICES.PORT,
        },
      },
    ]),
    CommonModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, JwtAuthGuard],
})
export class NotificationModule {}
