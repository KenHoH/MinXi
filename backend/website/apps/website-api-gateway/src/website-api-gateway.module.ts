import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/log.module';
import { ContentModule } from './content/content.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [UserModule, AuthModule, LogModule, ContentModule, HistoryModule],
  controllers: [],
  providers: [],
})
export class WebsiteApiGatewayModule {}
