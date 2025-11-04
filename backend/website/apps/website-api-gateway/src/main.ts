import { NestFactory } from '@nestjs/core';
import { WebsiteApiGatewayModule } from './website-api-gateway.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RpcTranslateFilter } from '@app/common/filters/rpc-translate/rpc-translate.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(WebsiteApiGatewayModule);
  app.useGlobalFilters(new RpcTranslateFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Website API')
    .setDescription('API documentation for Website Gateway')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local environment')
    .addTag('Website')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
