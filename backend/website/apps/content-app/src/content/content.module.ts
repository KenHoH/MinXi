import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { CommonModule } from '@app/common';
import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  CONNECT_SERVICES,
  HISTORY_SERVICES,
} from '@app/common/constants/services';

@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      {
        name: CONNECT_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: CONNECT_SERVICES.PORT,
        },
      },
      {
        name: HISTORY_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: HISTORY_SERVICES.PORT,
        },
      },
    ]),
  ],
  controllers: [ContentController],
  providers: [ContentService, ContentDatabaseConnection],
})
export class ContentModule {}
