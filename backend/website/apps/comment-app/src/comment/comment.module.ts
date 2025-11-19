import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommonModule } from '@app/common';
import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';

@Module({
  imports: [CommonModule],
  controllers: [CommentController],
  providers: [CommentService, ContentDatabaseConnection],
})
export class CommentModule {}
