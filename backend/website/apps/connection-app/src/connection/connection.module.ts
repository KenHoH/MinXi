import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionController } from './connection.controller';
import { CommonModule } from '@app/common';
import { UserDatabaseConnection } from '@app/common/database/user-database-connection/user-database-connection';

@Module({
  imports: [CommonModule],
  controllers: [ConnectionController],
  providers: [ConnectionService, UserDatabaseConnection],
})
export class ConnectionModule {}
