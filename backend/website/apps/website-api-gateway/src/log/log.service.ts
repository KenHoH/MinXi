import { Inject, Injectable } from '@nestjs/common';
import { LOG_SERVICES } from '@app/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { ILogService } from '@app/contracts/interfaces/log/ILogService';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { LogReq } from '@app/contracts/shared-dto/log/request/log.req.dto';
import { firstValueFrom } from 'rxjs';
import { LOG_MSG } from '@app/common/constants/messageEvent';
import { UserLog } from 'apps/log-app/src/log/entities/log.entity';

@Injectable()
export class LogService implements ILogService {
  constructor(@Inject(LOG_SERVICES.CLIENT) private client: ClientProxy) {}
  async create(userId: number, dto: LogReq) {
    return await firstValueFrom(
      this.client.send(LOG_MSG.create, { userId, dto }),
    );
  }
  async findOne(userId: number): Promise<UserLog[]> {
    return await firstValueFrom(this.client.send(LOG_MSG.findOne, { userId }));
  }

  async findAll(): Promise<UserLog[]> {
    return await firstValueFrom(this.client.send(LOG_MSG.findAll, {}));
  }
  async findDate(date: string): Promise<UserLog[]> {
    return await firstValueFrom(this.client.send(LOG_MSG.findDate, { date }));
  }

  async removeBefore(date: string): Promise<number> {
    return await firstValueFrom(this.client.send(LOG_MSG.remove, { date }));
  }
}
