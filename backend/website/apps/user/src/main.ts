import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { UserAppModule } from './user-app.module';
import { USER_SERVICES } from '@app/common/constants/services';
import { HttpToRpcFilter } from '@app/common/filters/http-to-rpc/http-to-rpc.filter';

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
  app.useGlobalFilters(new HttpToRpcFilter());
  await app.listen();
}
bootstrap();
