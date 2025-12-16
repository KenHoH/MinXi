import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICES } from '@app/common/constants/services';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '60s',
        },
      }),
    }),
    ClientsModule.register([
      {
        name: USER_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          host: 'user-service',
          port: USER_SERVICES.PORT,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
