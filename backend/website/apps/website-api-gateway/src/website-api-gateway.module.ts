import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [UserModule, AuthModule, LogModule],
  controllers: [],
  providers: [],
})
export class WebsiteApiGatewayModule {}
