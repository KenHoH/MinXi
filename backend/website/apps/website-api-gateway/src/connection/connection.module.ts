import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionController } from './connection.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CONNECT_SERVICES } from '@app/common/constants/services';
import { CommonModule } from '@app/common';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: CONNECT_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: CONNECT_SERVICES.PORT,
        },
      },
    ]),
    CommonModule,
  ],
  controllers: [ConnectionController],
  providers: [ConnectionService, JwtAuthGuard, LogInterceptor],
})
export class ConnectionModule {}
