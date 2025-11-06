import { Module } from '@nestjs/common';
import { WebsiteApiGatewayController } from './website-api-gateway.controller';
import { WebsiteApiGatewayService } from './website-api-gateway.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [UserModule, AuthModule, LogModule],
  controllers: [WebsiteApiGatewayController],
  providers: [WebsiteApiGatewayService],
})
export class WebsiteApiGatewayModule {}
