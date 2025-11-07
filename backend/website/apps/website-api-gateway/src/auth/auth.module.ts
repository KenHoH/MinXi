import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICES } from '@app/common/constants/services';
import { AuthModule as AuthModuleCommon } from '@app/common/guard/auth.module';
import { JwtRefreshGuard } from '@app/common/guard/jwt-refresh-guard/jwt-refresh.guard';
import { CommonModule } from '@app/common';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: { port: AUTH_SERVICES.PORT },
      },
    ]),
    AuthModuleCommon,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtRefreshGuard],
})
export class AuthModule {}
