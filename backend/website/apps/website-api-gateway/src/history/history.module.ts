import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HISTORY_SERVICES } from '@app/common/constants/services';
import { CommonModule } from '@app/common';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: HISTORY_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: HISTORY_SERVICES.PORT,
        },
      },
    ]),
    CommonModule,
  ],
  controllers: [HistoryController],
  providers: [HistoryService, JwtAuthGuard, LogInterceptor],
})
export class HistoryModule {}
