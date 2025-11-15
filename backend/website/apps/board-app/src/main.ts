import { NestFactory } from '@nestjs/core';
import { BoardAppModule } from './board-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BOARD_SERVICES } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BoardAppModule,
    {
      transport: Transport.TCP,
      options: {
        port: BOARD_SERVICES.PORT,
      },
    },
  );
  await app.listen();
}
bootstrap();
