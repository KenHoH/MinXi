import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { UserAppModule } from './user-app.module';
import { USER_SERVICES } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserAppModule,
    {
      transport: Transport.TCP,
      options: {
        port: USER_SERVICES.PORT,
      },
    },
  );
  await app.listen();
}
bootstrap();
