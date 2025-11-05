import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { UserDatabaseConnection } from './database/user-database-connection/user-database-connection';
import { AuthModule } from './auth/auth.module';

@Module({
  providers: [CommonService, UserDatabaseConnection],
  exports: [CommonService, UserDatabaseConnection],
  imports: [AuthModule],
})
export class CommonModule {}
