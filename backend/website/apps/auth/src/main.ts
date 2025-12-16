import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AuthAppModule } from './auth-app.module';
import { AUTH_SERVICES } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthAppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'auth-service',
        port: AUTH_SERVICES.PORT,
      },
    },
  );
  await app.listen();
}
bootstrap();
