import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICES } from '@app/common/constants/services';
import * as dotenv from 'dotenv';

dotenv.config({ path: './libs/common/src/guard/.env' });

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './libs/common/src/auth/.env',
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '60s' },
      }),
    }),
    ClientsModule.register([
      {
        name: USER_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: USER_SERVICES.PORT,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
