import { RoomResponseDto } from '@app/contracts/shared-dto/social/response/RoomResDTO';

export function mapRoomToResponse(room: any): RoomResponseDto {
  return {
    id: room.id,
    name: room.name,
    type: room.type,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    pictureUrl: room.pictureUrl,
  };
}
