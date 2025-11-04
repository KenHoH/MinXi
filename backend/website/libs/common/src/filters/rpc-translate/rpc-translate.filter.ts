import { RpcCustomException } from '@app/common/errors/error-rpc';
import { Catch, ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class RpcTranslateFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcTranslateFilter.name);
  catch(exception: RpcCustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const message = exception.message ?? 'Internal server error';
    return res.status(exception.code).json({
      statusCode: exception.code,
      message,
      details: exception.details,
      timestamp: new Date().toISOString(),
    });
  }
}
