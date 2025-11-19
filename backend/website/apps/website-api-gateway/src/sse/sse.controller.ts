import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { SseService } from './sse.service';
import { BroadcastMsgReq } from '@app/contracts/shared-dto/sse/req/BroadcastMsgReq';
import { Observable } from 'rxjs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { BroadcastNotifReq } from '@app/contracts/shared-dto/sse/req/BroadcastNotifReq';

@Controller('sse')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('subscribe/rooms/:roomId')
  subscribeToRoom(
    @Param('roomId') roomId: string,
  ): Promise<Observable<MessageEvent>> {
    return this.sseService.subscribeToRoom(roomId);
  }

  @Post('sendBroadcastToRoom')
  sendBroadcast(@Body() dto: BroadcastMsgReq) {
    return this.sseService.sendBroadcast(dto.roomId, dto);
  }

  @Post('sendNotificationToRoom')
  sendNotification(@Body() dto: BroadcastNotifReq) {
    return this.sseService.sendNotification(dto.userId, dto);
  }

  @Get('stats')
  getStats() {
    return this.sseService.getConnectionStats();
  }
}
