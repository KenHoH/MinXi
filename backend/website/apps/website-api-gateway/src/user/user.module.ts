import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICES } from '@app/common/constants/services';
import { AuthModule } from '@app/common/auth/auth.module';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth-guard/jwt-auth.guard';
import { AdminGuard } from '@app/common/auth/admin/admin.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: { port: USER_SERVICES.PORT },
      },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard, AdminGuard],
})
export class UserModule {}
