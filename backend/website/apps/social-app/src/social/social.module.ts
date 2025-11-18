import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { CommonModule } from '@app/common';
import { SocialDatabaseConnection } from '@app/common/database/social-database-connection/social-database-connection';
import { MessageDatabaseConnection } from '@app/common/database/message-database-connection/message-database-connection';

@Module({
  imports: [CommonModule],
  controllers: [SocialController],
  providers: [
    SocialService,
    SocialDatabaseConnection,
    MessageDatabaseConnection,
  ],
})
export class SocialModule {}
