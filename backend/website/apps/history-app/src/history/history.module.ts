import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { CommonModule } from '@app/common';
import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';

@Module({
  imports: [CommonModule],
  controllers: [HistoryController],
  providers: [HistoryService, ContentDatabaseConnection],
})
export class HistoryModule {}
