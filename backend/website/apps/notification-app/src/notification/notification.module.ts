import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { CommonModule } from '@app/common';
import { LogDatabaseConnection } from '@app/common/database/log-database-connection/log-database-connection';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICES } from '@app/common/constants/services';

@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      {
        name: USER_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          host: 'user-service',
          port: USER_SERVICES.PORT,
        },
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, LogDatabaseConnection],
})
export class NotificationModule {}
