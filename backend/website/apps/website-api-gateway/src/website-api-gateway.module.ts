import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/log.module';
import { ContentModule } from './content/content.module';
import { HistoryModule } from './history/history.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [UserModule, AuthModule, LogModule, ContentModule, HistoryModule, BoardModule],
  controllers: [],
  providers: [],
})
export class WebsiteApiGatewayModule {}
