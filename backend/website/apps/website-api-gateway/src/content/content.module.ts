import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CONTENT_SERVICES } from '@app/common/constants/services';
import { CommonModule } from '@app/common';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: CONTENT_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: CONTENT_SERVICES.PORT,
        },
      },
    ]),
    CommonModule,
  ],
  controllers: [ContentController],
  providers: [ContentService, JwtAuthGuard, LogInterceptor],
})
export class ContentModule {}
