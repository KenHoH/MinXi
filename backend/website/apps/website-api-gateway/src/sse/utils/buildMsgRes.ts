import { MessageResponseDto } from '@app/contracts/shared-dto/social/response/messageResDTO';
import { BroadcastMsgReq } from '@app/contracts/shared-dto/sse/req/BroadcastMsgReq';

export function buildMessageResponse(dto: any): MessageResponseDto {
  return {
    id: dto.id,
    authorId: dto.authorId,
    content: dto.content,
    mediaUrl: dto.mediaUrl,
    createdAt: new Date(),
    roomId: dto.roomId,
  };
}
