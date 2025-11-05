import { HttpException, Logger } from '@nestjs/common';
import { RpcCustomException } from '../errors/error-rpc';

export function httpToRpc(
  error: HttpException | Error | any,
): RpcCustomException {
  const logger = new Logger(httpToRpc.name);
  logger.fatal('HttpToRpc');
  if (error instanceof HttpException) {
    const response = error.getResponse() as any;
    const status = error.getStatus();

    const message =
      typeof response === 'string'
        ? response
        : response?.message || error.message || 'Unexpected error';

    const details =
      typeof response === 'object' && response?.details
        ? response.details
        : null;

    return new RpcCustomException(status, message, details);
  }

  const message = error?.message || 'Internal Server Error';
  return new RpcCustomException(500, message);
}
