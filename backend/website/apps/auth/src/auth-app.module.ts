import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonModule } from '@app/common';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AuthAppModule {}
