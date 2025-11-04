import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICES } from '@app/common/constants/services';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: { port: AUTH_SERVICES.PORT },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
