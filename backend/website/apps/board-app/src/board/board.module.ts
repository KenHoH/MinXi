import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { CommonModule } from '@app/common';
import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';

@Module({
  imports: [CommonModule],
  controllers: [BoardController],
  providers: [BoardService, ContentDatabaseConnection],
})
export class BoardModule {}
