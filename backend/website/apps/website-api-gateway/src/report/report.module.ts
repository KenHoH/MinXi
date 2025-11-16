import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { CommonModule } from '@app/common';
import { AdminGuard } from '@app/common/guard/admin/admin.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REPORT_SERVICES } from '@app/common/constants/services';

@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      {
        name: REPORT_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: { port: REPORT_SERVICES.PORT },
      },
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService, AdminGuard, LogInterceptor],
})
export class ReportModule {}
