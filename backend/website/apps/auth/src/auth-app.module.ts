import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JwtRefresh } from './auth/jwt-refresh/jwt-refresh';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [JwtRefresh],
})
export class AuthAppModule {}
