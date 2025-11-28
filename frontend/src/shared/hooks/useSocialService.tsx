import { SocialService } from "../../service/api/services/SocialService";
import type { CreateRoomDto } from "../../service/api/models/CreateRoomDto";
import type { AddUserToRoomDto } from "../../service/api/models/AddUserToRoomDto";
import type { RemoveUserFromRoomDto } from "../../service/api/models/RemoveUserFromRoomDto";
import type { UpdateParticipantRoleDto } from "../../service/api/models/UpdateParticipantRoleDto";
import type { SendMessageDto } from "../../service/api/models/SendMessageDto";
import type { FindDmDto } from "../../service/api/models/FindDmDto";
import type { RoomResponseDto } from "../../service/api/models/RoomResponseDto";
import type { ParticipantResponseDto } from "../../service/api/models/ParticipantResponseDto";
import type { ParticipantTotalResDTO } from "../../service/api/models/ParticipantTotalResDTO";
import type { MessageResponseDto } from "../../service/api/models/MessageResponseDto";
import useApiCall from "./useApiCall";

export default function useSocialService() {
  const { call, data, loading, error } = useApiCall();

  const createRoom = (dto: CreateRoomDto) =>
    call<RoomResponseDto>(() => SocialService.socialControllerCreateRoom(dto));

  const getRoomInfo = (roomId: string) =>
    call<RoomResponseDto>(() =>
      SocialService.socialControllerGetRoomInfo(roomId)
    );

  const getAllRoomId = (userId: number) =>
    call<RoomResponseDto[]>(() =>
      SocialService.socialControllerGetAllRoomId(userId)
    );

  const addUserToRoom = (dto: AddUserToRoomDto) =>
    call<ParticipantResponseDto>(() =>
      SocialService.socialControllerAddUserToRoom(dto)
    );

  const removeUserFromRoom = (dto: RemoveUserFromRoomDto) =>
    call<ParticipantResponseDto>(() =>
      SocialService.socialControllerRemoveUserFromRoom(dto)
    );

  const updateParticipantRole = (dto: UpdateParticipantRoleDto) =>
    call<ParticipantResponseDto>(() =>
      SocialService.socialControllerUpdateParticipantRole(dto)
    );

  const getTotalParticipants = (roomId: string) =>
    call<ParticipantTotalResDTO>(() =>
      SocialService.socialControllerGetTotalParticipants(roomId)
    );

  const getParticipant = (roomId: string) =>
    call<ParticipantResponseDto>(() =>
      SocialService.socialControllerGetParticipant(roomId)
    );

  const getMedia = (roomId: string) =>
    call<MessageResponseDto>(() =>
      SocialService.socialControllerGetMedia(roomId)
    );

  const sendMessage = (dto: SendMessageDto) =>
    call<MessageResponseDto>(() =>
      SocialService.socialControllerSendMessage(dto)
    );

  const getMessage = (roomId: string, limit: number) =>
    call<MessageResponseDto[]>(() =>
      SocialService.socialControllerGetMessage(roomId, limit)
    );

  const findDm = (dto: FindDmDto) =>
    call<RoomResponseDto>(() => SocialService.socialControllerFindDm(dto));

  return {
    createRoom,
    getRoomInfo,
    getAllRoomId,
    addUserToRoom,
    removeUserFromRoom,
    updateParticipantRole,
    getTotalParticipants,
    getParticipant,
    getMedia,
    sendMessage,
    getMessage,
    findDm,
    result: data,
    loading,
    error,
  };
}
