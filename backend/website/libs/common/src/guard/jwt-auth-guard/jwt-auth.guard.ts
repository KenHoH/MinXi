import { httpToRpc } from '@app/common/utils/httpToRpc';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('access') {
  handleRequest(err, user, info, context: ExecutionContext) {
    const logger = new Logger(JwtAuthGuard.name);

    logger.error('JwtAuthGuard');

    if (err || !user) {
      throw new HttpException('Not Authorize', HttpStatus.FORBIDDEN);
    }
    return user;
  }
}
