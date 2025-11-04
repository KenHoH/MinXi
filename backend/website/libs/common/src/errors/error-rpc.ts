import { RpcException } from '@nestjs/microservices';

export class RpcCustomException extends RpcException {
  constructor(
    public readonly code: number,
    public readonly message: string,
    public readonly details?: any,
  ) {
    super({ code, message, details });
  }
}
