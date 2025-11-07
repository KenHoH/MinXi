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
export class JwtRefreshGuard extends AuthGuard('refresh') {
  handleRequest(err, user, info, context: ExecutionContext) {
    const logger = new Logger(JwtRefreshGuard.name);

    logger.error('JwtRefresh');
    if (err || !user) {
      throw new HttpException('Not Authorize', HttpStatus.FORBIDDEN);
    }
    return user;
  }
}
