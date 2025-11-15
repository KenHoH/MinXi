import { NestFactory } from '@nestjs/core';
import { HistoryAppModule } from './history-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HISTORY_SERVICES } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    HistoryAppModule,
    {
      transport: Transport.TCP,
      options: {
        port: HISTORY_SERVICES.PORT,
      },
    },
  );
  await app.listen();
}
bootstrap();
