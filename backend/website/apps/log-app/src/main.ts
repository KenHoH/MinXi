import { NestFactory } from '@nestjs/core';
import { LogAppModule } from './log-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LOG_SERVICES } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    LogAppModule,
    {
      transport: Transport.TCP,
      options: {
        port: LOG_SERVICES.PORT,
      },
    },
  );
  await app.listen();
}
bootstrap();
