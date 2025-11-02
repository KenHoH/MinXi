import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { UserDatabaseConnection } from './database/user-database-connection/user-database-connection';

@Module({
  providers: [CommonService, UserDatabaseConnection],
  exports: [CommonService, UserDatabaseConnection],
})
export class CommonModule {}
