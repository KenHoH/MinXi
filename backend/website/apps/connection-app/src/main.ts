import { NestFactory } from '@nestjs/core';
import { ConnectionAppModule } from './connection-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CONNECT_SERVICES } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ConnectionAppModule,
    {
      transport: Transport.TCP,
      options: {
        port: CONNECT_SERVICES.PORT,
      },
    },
  );
  await app.listen();
}
bootstrap();
