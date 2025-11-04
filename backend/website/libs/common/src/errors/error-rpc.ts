// common/errors/rpc-exception.ts
import { RpcException } from '@nestjs/microservices';

export class RpcCustomException extends RpcException {
  constructor(
    public readonly code: number, // e.g., HTTP status
    public readonly message: string,
    public readonly details?: any, // optional metadata
  ) {
    super({ code, message, details });
  }
}
