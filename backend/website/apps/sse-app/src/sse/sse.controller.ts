import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SseService } from './sse.service';
import { SSE_MSG } from '@app/common/constants/messageEvent';
import { MessageResponseDto } from '@app/contracts/shared-dto/social/response/messageResDTO';
import { BroadcastMsgReq } from '@app/contracts/shared-dto/sse/req/BroadcastMsgReq';

@Controller()
export class SseController {
  constructor(private readonly sseService: SseService) {}
  @MessagePattern(SSE_MSG.sendBroadcast)
  async sendBroadcast(@Payload() dto: BroadcastMsgReq) {
    return this.sseService.sendBroadcast(dto.roomId, dto);
  }
}
