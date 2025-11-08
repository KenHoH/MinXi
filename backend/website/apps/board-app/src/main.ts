import { NestFactory } from '@nestjs/core';
import { BoardAppModule } from './board-app.module';

async function bootstrap() {
  const app = await NestFactory.create(BoardAppModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
