import { Module } from '@nestjs/common';
import { WebsiteApiGatewayController } from './website-api-gateway.controller';
import { WebsiteApiGatewayService } from './website-api-gateway.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [WebsiteApiGatewayController],
  providers: [WebsiteApiGatewayService],
})
export class WebsiteApiGatewayModule {}
