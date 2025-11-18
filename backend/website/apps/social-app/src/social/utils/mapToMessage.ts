import { MessageResponseDto } from '@app/contracts/shared-dto/social/response/messageResDTO';

export function mapMessageToResponse(message: any): MessageResponseDto {
  return {
    id: message.id,
    roomId: message.roomId,
    content: message.content,
    mediaUrl: message.mediaUrl,
    createdAt: message.createdAt,
    authorId: message.authorId,
  };
}
