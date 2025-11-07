import { LOG_MSG } from '@app/common/constants/messageEvent';
import { LOG_SERVICES } from '@app/common/constants/services';
import { LogReq } from '@app/contracts/shared-dto/log/request/log.req.dto';
import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { randomInt } from 'crypto';
import { from, Observable, switchMap, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOG_SERVICES.CLIENT) private client: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getUserIdFromToken(authHeader: any) {
    try {
      const token = authHeader.split(' ')[1];
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      if (!payload.sub || !payload.username)
        throw new ForbiddenException('Invalid token payload');

      return payload.sub;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger = new Logger(LogInterceptor.name);

    logger.log('Before');

    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const path = req.url;
    const authHeader = req.headers['authorization'];

    return from(this.getUserIdFromToken(authHeader)).pipe(
      switchMap((userId) => {
        logger.log(`User ${userId} -> ${method} ${path}`);

        const dto: LogReq = {
          method: method,
          path: path,
          meta: {
            headers: req.headers,
            query: req.query,
            body: req.body,
          },
        };

        return next.handle().pipe(
          tap({
            next: () => {
              logger.log(`Completed ${method} ${path} by user ${userId}`);
              logger.log(dto);
              if (Math.random() < 0.2)
                this.client.send(LOG_MSG.create, { userId, dto }).subscribe({
                  complete: () => logger.log('Success sending the message'),
                  error: (err) =>
                    logger.error(
                      `Log service failed to process request for ${method} ${path} by user ${userId}: ${err.message}`,
                    ),
                });
            },
            error: (err) =>
              logger.error(
                `Failed ${method} ${path} by user ${userId}: ${err.message}`,
              ),
          }),
        );
      }),
    );

    return next.handle().pipe(tap(() => logger.log('after')));
  }
}
