import { RpcErrorPayload } from '@app/common/interfaces/RpcErrorPayload';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcToHttpFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    // Backup Code if something went wrong
    // const ctx = host.switchToHttp();
    // const response = ctx.getResponse();
    // const { status, message } = exception.getError() as RpcErrorPayload;
    // response.status(status).json({ statusCode: status, message });

    const { status, message } = exception.getError() as RpcErrorPayload;
    throw new HttpException(message, status);
  }
}
