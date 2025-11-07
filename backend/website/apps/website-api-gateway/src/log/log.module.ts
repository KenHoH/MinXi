import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LOG_SERVICES } from '@app/common/constants/services';
import { ContractsModule } from '@app/contracts';
import { CommonModule } from '@app/common';
import { AdminGuard } from '@app/common/guard/admin/admin.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: LOG_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: { port: LOG_SERVICES.PORT },
      },
    ]),
    ContractsModule,
    CommonModule,
  ],
  controllers: [LogController],
  providers: [LogService, AdminGuard],
})
export class LogModule {}
