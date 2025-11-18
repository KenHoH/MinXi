import { ParticipantResponseDto } from '@app/contracts/shared-dto/social/response/participantDTO';

export function mapParticipantToResponse(
  participant: any,
): ParticipantResponseDto {
  return {
    id: participant.id,
    userId: participant.userId,
    roomId: participant.roomId,
    role: participant.role,
  };
}
