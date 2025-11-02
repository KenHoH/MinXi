import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CommonModule } from '@app/common';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class UserAppModule {}
