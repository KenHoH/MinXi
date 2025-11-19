import { NestFactory } from '@nestjs/core';
import { CommentAppModule } from './comment-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { COMMENT_SERVICES } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CommentAppModule,
    {
      transport: Transport.TCP,
      options: {
        port: COMMENT_SERVICES.PORT,
      },
    },
  );
  await app.listen();
}
bootstrap();
