import { RpcCustomException } from '@app/common/errors/error-rpc';
import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class RpcTranslateFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcTranslateFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const contextType = host.getType();

    if (contextType === 'http') {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<Response>();

      const status =
        typeof exception.getStatus === 'function'
          ? exception.getStatus()
          : (exception.code ?? 500);

      const message =
        typeof exception.getResponse === 'function'
          ? exception.getResponse()
          : (exception.message ?? 'Internal serverer error');

      this.logger.error(`HTTP Exception: ${message}`);
      this.logger.error(`HTTP Exception Status: ${status}`);

      return res.status(status).json({
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
      });
    }

    if (contextType === 'rpc') {
      this.logger.error(
        `RPC Exception caught: ${exception.message ?? exception}`,
      );
      throw new RpcCustomException(
        exception.code ?? 500,
        exception.message ?? 'Internal servers error',
      );
    }

    this.logger.error(`Unknown context type: ${contextType}`);
  }
}
