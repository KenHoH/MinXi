import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Repository } from './repository/repository';
import { CommonModule } from '@app/common';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [UserService, Repository],
})
export class UserModule {}
