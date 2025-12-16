import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { CommonModule } from '@app/common';
import { AdminGuard } from '@app/common/guard/admin/admin.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REPORT_SERVICES } from '@app/common/constants/services';
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
    CommonModule,
    ClientsModule.register([
      {
        name: REPORT_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: { host: 'report-service', port: REPORT_SERVICES.PORT },
      },
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService, AdminGuard, LogInterceptor],
})
export class ReportModule {}
