import { NestFactory } from '@nestjs/core';
import { ContentAppModule } from './content-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CONTENT_SERVICES } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ContentAppModule,
    {
      transport: Transport.TCP,
      options: {
        port: CONTENT_SERVICES.PORT,
      },
    },
  );
  await app.listen();
}
bootstrap();
