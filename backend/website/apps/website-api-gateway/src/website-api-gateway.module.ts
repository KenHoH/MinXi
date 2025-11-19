import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/log.module';
import { ContentModule } from './content/content.module';
import { HistoryModule } from './history/history.module';
import { BoardModule } from './board/board.module';
import { ConnectionModule } from './connection/connection.module';
import { ReportModule } from './report/report.module';
import { AlgorithmModule } from './algorithm/algorithm.module';
import { SseModule } from './sse/sse.module';
import { SocialModule } from './social/social.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    LogModule,
    ContentModule,
    HistoryModule,
    BoardModule,
    ConnectionModule,
    ReportModule,
    AlgorithmModule,
    SseModule,
    SocialModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class WebsiteApiGatewayModule {}
