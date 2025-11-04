import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const error = exception.getError() as any;

    const status = error.code || 500;
    const message = error.message || 'Unknown microservice error';

    response.status(status).json({
      statusCode: status,
      message,
      details: error.details || null,
      timestamp: new Date().toISOString(),
    });
  }
}
