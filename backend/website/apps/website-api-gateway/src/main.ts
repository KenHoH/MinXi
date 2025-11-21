import { NestFactory } from '@nestjs/core';
import { WebsiteApiGatewayModule } from './website-api-gateway.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RpcTranslateFilter } from '@app/common/filters/rpc-translate/rpc-translate.filter';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    WebsiteApiGatewayModule,
  );

  app.use(
    '/uploads',
    express.static('uploads', {
      setHeaders: (res, path, stat) => {
        res.removeHeader('Content-Disposition');

        if (path.endsWith('.mp4')) {
          res.setHeader('Content-Type', 'video/mp4');
        }
      },
    }),
  );
  app.use(cookieParser());

  app.useGlobalFilters(new RpcTranslateFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  app.enableCors({
    origin: 'https://localhost:5173',
    methods: methods,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('Website API')
    .setDescription('API documentation for Website Gateway')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local environment')
    .addTag('Website')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
