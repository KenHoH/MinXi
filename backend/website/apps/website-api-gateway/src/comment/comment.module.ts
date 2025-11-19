import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommonModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { COMMENT_SERVICES } from '@app/common/constants/services';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: COMMENT_SERVICES.CLIENT,
        transport: Transport.TCP,
        options: {
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
