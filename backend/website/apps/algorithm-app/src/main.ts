import { NestFactory } from '@nestjs/core';
import { AlgorithmAppModule } from './algorithm-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ALGO_SERVICES } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AlgorithmAppModule,
    {
      transport: Transport.TCP,
      options: { host: 'algo-service', port: ALGO_SERVICES.PORT },
    },
  );
  await app.listen();
}
bootstrap();
