import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch(HttpException)
export class HttpToRpcFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const response = exception.getResponse();

    const message =
      typeof response === 'string'
        ? response
        : (response as any).message || 'Unknown error';

    // Throw error because we use observable
    return throwError(() => new RpcException({ status, message }));
  }
}
