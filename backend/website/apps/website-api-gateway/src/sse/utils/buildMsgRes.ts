import { MessageResponseDto } from '@app/contracts/shared-dto/social/response/messageResDTO';

export function buildMessageResponse(dto: any): MessageResponseDto {
  return {
    id: dto.id,
    authorId: dto.authorId,
    content: dto.content,
    mediaUrl: dto.mediaUrl,
    createdAt: new Date(),
    roomId: dto.roomId,
    type: dto.type || 'TEXT',
    authorName: dto.authorName,
    authorProfileUrl: dto.authorProfileUrl,
  };
}
