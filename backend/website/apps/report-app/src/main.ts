import { NestFactory } from '@nestjs/core';
import { ReportAppModule } from './report-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { REPORT_SERVICES } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ReportAppModule,
    {
      transport: Transport.TCP,
      options: { host: 'report-service', port: REPORT_SERVICES.PORT },
    },
  );
  await app.listen();
}
bootstrap();
