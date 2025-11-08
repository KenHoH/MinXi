import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { UserDatabaseConnection } from './database/user-database-connection/user-database-connection';
import { AuthModule } from './guard/auth.module';
import { LogInterceptor } from './interceptor/log/log.interceptor';
import { LogDatabaseConnection } from './database/log-database-connection/log-database-connection';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LOG_SERVICES } from './constants/services';
import { ContentDatabaseConnection } from './database/content-database-connection/content-database-connection';

@Module({
  providers: [
    CommonService,
    UserDatabaseConnection,
    LogInterceptor,
    LogDatabaseConnection,
    ContentDatabaseConnection,
  ],
  exports: [
    CommonService,
    UserDatabaseConnection,
    LogDatabaseConnection,
    ContentDatabaseConnection,
    ClientsModule,
  ],
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: LOG_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: LOG_SERVICES.PORT,
        },
      },
    ]),
  ],
})
export class CommonModule {}
