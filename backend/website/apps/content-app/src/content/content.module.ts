import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { CommonModule } from '@app/common';
import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';

@Module({
  imports: [CommonModule],
  controllers: [ContentController],
  providers: [ContentService, ContentDatabaseConnection],
})
export class ContentModule {}
