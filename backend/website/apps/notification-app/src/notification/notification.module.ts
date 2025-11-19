import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { CommonModule } from '@app/common';
import { LogDatabaseConnection } from '@app/common/database/log-database-connection/log-database-connection';

@Module({
  imports: [CommonModule],
  controllers: [NotificationController],
  providers: [NotificationService, LogDatabaseConnection],
})
export class NotificationModule {}
