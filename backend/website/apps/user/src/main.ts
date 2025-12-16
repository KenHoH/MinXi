import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { UserAppModule } from './user-app.module';
import { USER_SERVICES } from '@app/common/constants/services';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserAppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'user-service',
        port: USER_SERVICES.PORT,
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
    }),
  );
  await app.listen();
}
bootstrap();
