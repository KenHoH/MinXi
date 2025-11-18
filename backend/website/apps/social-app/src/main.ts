import { NestFactory } from '@nestjs/core';
import { SocialAppModule } from './social-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SOCIAL_SERVICES } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SocialAppModule,
    {
      transport: Transport.TCP,
      options: {
        port: SOCIAL_SERVICES.PORT,
      },
    },
  );
  await app.listen();
}
bootstrap();
