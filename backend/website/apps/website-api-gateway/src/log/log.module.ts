import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LOG_SERVICES } from '@app/common/constants/services';
import { ContractsModule } from '@app/contracts';
import { CommonModule } from '@app/common';
import { AdminGuard } from '@app/common/guard/admin/admin.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined');
        }

        return {
          secret,
          signOptions: {
            expiresIn: '60s',
          },
        };
      },
    }),
    ClientsModule.register([
      {
        name: LOG_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: { host: 'log-service', port: LOG_SERVICES.PORT },
      },
    ]),
    ContractsModule,
    CommonModule,
  ],
  controllers: [LogController],
  providers: [LogService, AdminGuard],
})
export class LogModule {}
