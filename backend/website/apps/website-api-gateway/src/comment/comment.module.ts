import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommonModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { COMMENT_SERVICES } from '@app/common/constants/services';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';

@Module({
  imports: [
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
        name: COMMENT_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
          host: 'comment-service',
          port: COMMENT_SERVICES.PORT,
        },
      },
    ]),
    CommonModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, JwtAuthGuard],
})
export class CommentModule {}
