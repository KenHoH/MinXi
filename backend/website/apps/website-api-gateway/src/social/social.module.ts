import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SOCIAL_SERVICES } from '@app/common/constants/services';
import { CommonModule } from '@app/common';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';

@Module({
  imports: [
    ClientsModule.register([
      {
        transport: Transport.TCP,
        name: SOCIAL_SERVICES.CLIENT,
        options: {
          port: SOCIAL_SERVICES.PORT,
        },
      },
    ]),
    CommonModule,
  ],
  controllers: [SocialController],
  providers: [SocialService, JwtAuthGuard],
})
export class SocialModule {}
