import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { CommonModule } from '@app/common';
import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CONTENT_SERVICES } from '@app/common/constants/services';

@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      {
        name: CONTENT_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: CONTENT_SERVICES.PORT,
        },
      },
    ]),
  ],
  controllers: [BoardController],
  providers: [BoardService, ContentDatabaseConnection],
})
export class BoardModule {}
