import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { LogReq } from '@app/contracts/shared-dto/log/request/log.req.dto';
import { UserLog } from 'apps/log-app/src/log/entities/log.entity';

export interface ILogService {
  create(userId: number, dto: LogReq): Promise<Ack>;
  findAll(): Promise<UserLog[]>;
  findOne(userId: number): Promise<UserLog[]>;
  findDate(date: string): Promise<UserLog[]>;
  removeBefore(date: string): Promise<number>;
}
