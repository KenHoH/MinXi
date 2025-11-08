import { NestFactory } from '@nestjs/core';
import { ContentAppModule } from './content-app.module';

async function bootstrap() {
  const app = await NestFactory.create(ContentAppModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
