import { NestFactory } from '@nestjs/core';
import { NotificationAppModule } from './notification-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NOTIF_SERVICES } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationAppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'notif-service',
        port: NOTIF_SERVICES.PORT,
      },
    },
  );
  await app.listen();
}
bootstrap();
