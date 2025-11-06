import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { UserDatabaseConnection } from './database/user-database-connection/user-database-connection';
import { AuthModule } from './auth/auth.module';
import { LogInterceptor } from './interceptor/log/log.interceptor';
import { LogDatabaseConnection } from './database/log-database-connection/log-database-connection';

@Module({
  providers: [
    CommonService,
    UserDatabaseConnection,
    LogInterceptor,
    LogDatabaseConnection,
  ],
  exports: [CommonService, UserDatabaseConnection, LogDatabaseConnection],
  imports: [AuthModule],
})
export class CommonModule {}
