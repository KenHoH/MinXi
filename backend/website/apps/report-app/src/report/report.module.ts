import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { CommonModule } from '@app/common';
import { LogDatabaseConnection } from '@app/common/database/log-database-connection/log-database-connection';

@Module({
  imports: [CommonModule],
  controllers: [ReportController],
  providers: [ReportService, LogDatabaseConnection],
})
export class ReportModule {}
