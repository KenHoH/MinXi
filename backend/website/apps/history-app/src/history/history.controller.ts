import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from '@app/contracts/shared-dto/content/req/CreateHistory.dto';
import { HISTORY_MSG } from '@app/common/constants/messageEvent';

@Controller()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @MessagePattern(HISTORY_MSG.upsert)
  upsert(@Payload() dto: CreateHistoryDto) {
    return this.historyService.upsert(dto);
  }
  @MessagePattern(HISTORY_MSG.getByUser)
  getByUser(@Payload() user_id: number) {
    return this.historyService.getByUser(user_id);
  }
  @MessagePattern(HISTORY_MSG.getByUserAndContent)
  getByUserAndContent(
    @Payload() payload: { user_id: number; content_id: number },
  ) {
    return this.historyService.getByUserAndContent(
      payload.user_id,
      payload.content_id,
    );
  }
  @MessagePattern(HISTORY_MSG.deleteByContentId)
  deleteByContentId(@Payload() content_id: number) {
    return this.historyService.deleteByContentId(content_id);
  }
}
