import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BOARD_SERVICES } from '@app/common/constants/services';
import { CommonModule } from '@app/common';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: BOARD_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: BOARD_SERVICES.PORT,
        },
      },
    ]),
    CommonModule,
  ],
  controllers: [BoardController],
  providers: [BoardService, JwtAuthGuard, LogInterceptor],
})
export class BoardModule {}
