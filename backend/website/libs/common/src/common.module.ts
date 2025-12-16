import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { UserDatabaseConnection } from './database/user-database-connection/user-database-connection';
import { AuthModule } from './guard/auth.module';
import { LogInterceptor } from './interceptor/log/log.interceptor';
import { LogDatabaseConnection } from './database/log-database-connection/log-database-connection';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LOG_SERVICES } from './constants/services';
import { ContentDatabaseConnection } from './database/content-database-connection/content-database-connection';
import { MessageDatabaseConnection } from './database/message-database-connection/message-database-connection';
import { SocialDatabaseConnection } from './database/social-database-connection/social-database-connection';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [
    CommonService,
    UserDatabaseConnection,
    LogInterceptor,
    LogDatabaseConnection,
    ContentDatabaseConnection,
    SocialDatabaseConnection,
    MessageDatabaseConnection,
  ],
  exports: [
    CommonService,
    UserDatabaseConnection,
    LogDatabaseConnection,
    SocialDatabaseConnection,
    MessageDatabaseConnection,
    ContentDatabaseConnection,
    ClientsModule,
  ],
  imports: [
    AuthModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined');
        }

        return {
          secret,
          signOptions: {
            expiresIn: '60s',
          },
        };
      },
    }),
    ClientsModule.register([
      {
        name: LOG_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          port: LOG_SERVICES.PORT,
        },
      },
    ]),
  ],
})
export class CommonModule {}
