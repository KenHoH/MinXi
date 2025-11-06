import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LogService } from './log.service';
import { LogReq } from '@app/contracts/shared-dto/log/request/log.req.dto';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { UserLog } from './entities/log.entity';
import { LOG_MSG } from '@app/common/constants/messageEvent';

@Controller()
export class LogController {
  constructor(private readonly logService: LogService) {}

  @MessagePattern(LOG_MSG.create)
  async create(@Payload() data: { userId: number; dto: LogReq }): Promise<Ack> {
    return this.logService.create(data.userId, data.dto);
  }

  @MessagePattern(LOG_MSG.findAll)
  async findAll(): Promise<UserLog[]> {
    return this.logService.findAll();
  }

  @MessagePattern(LOG_MSG.findOne)
  async findOne(@Payload('userId') userId: number): Promise<UserLog[]> {
    return this.logService.findOne(userId);
  }

  @MessagePattern(LOG_MSG.findDate)
  async findDate(@Payload('date') date: string): Promise<UserLog[]> {
    return this.logService.findDate(date);
  }

  @MessagePattern(LOG_MSG.remove)
  async removeBefore(@Payload('date') date: string): Promise<number> {
    return this.logService.removeBefore(date);
  }
}
