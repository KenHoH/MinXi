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

@Module({
  imports: [UserModule, AuthModule, LogModule, ContentModule, HistoryModule, BoardModule, ConnectionModule, ReportModule, AlgorithmModule],
  controllers: [],
  providers: [],
})
export class WebsiteApiGatewayModule {}
