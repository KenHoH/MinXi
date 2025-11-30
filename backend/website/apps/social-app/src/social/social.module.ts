import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { CommonModule } from '@app/common';
import { SocialDatabaseConnection } from '@app/common/database/social-database-connection/social-database-connection';
import { MessageDatabaseConnection } from '@app/common/database/message-database-connection/message-database-connection';
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
  controllers: [SocialController],
  providers: [
    SocialService,
    SocialDatabaseConnection,
    MessageDatabaseConnection,
  ],
})
export class SocialModule {}
