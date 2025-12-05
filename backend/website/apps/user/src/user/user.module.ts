import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Repository } from './repository/repository';
import { CommonModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CONTENT_SERVICES } from '@app/common/constants/services';

@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      {
        name: CONTENT_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: CONTENT_SERVICES.PORT,
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, Repository],
})
export class UserModule {}
