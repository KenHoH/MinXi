import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionController } from './connection.controller';
import { CommonModule } from '@app/common';
import { UserDatabaseConnection } from '@app/common/database/user-database-connection/user-database-connection';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SOCIAL_SERVICES, USER_SERVICES } from '@app/common/constants/services';

@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      {
        name: SOCIAL_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: SOCIAL_SERVICES.PORT,
        },
      },
      {
        name: USER_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: USER_SERVICES.PORT,
        },
      },
    ]),
  ],
  controllers: [ConnectionController],
  providers: [ConnectionService, UserDatabaseConnection],
})
export class ConnectionModule {}
