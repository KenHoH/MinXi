import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommonModule } from '@app/common';
import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';
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
          port: USER_SERVICES.PORT,
        },
      },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService, ContentDatabaseConnection],
})
export class CommentModule {}
