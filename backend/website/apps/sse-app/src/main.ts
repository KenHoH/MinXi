import { NestFactory } from '@nestjs/core';
import { SseAppModule } from './sse-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SSE_SERVICES } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SseAppModule,
    {
      transport: Transport.TCP,
      options: { port: SSE_SERVICES.PORT },
    },
  );
  await app.listen();
}
bootstrap();
