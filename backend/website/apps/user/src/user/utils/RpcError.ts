import { RpcException } from '@nestjs/microservices';

export function rpcError(status: number, message: string) {
  return new RpcException({ status, message });
}
