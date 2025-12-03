import { SocialService } from "../../service/api/services/SocialService";
import type { AddUserToRoomDto } from "../../service/api/models/AddUserToRoomDto";
import type { RemoveUserFromRoomDto } from "../../service/api/models/RemoveUserFromRoomDto";
import type { UpdateParticipantRoleDto } from "../../service/api/models/UpdateParticipantRoleDto";
import type { SendMessageDto } from "../../service/api/models/SendMessageDto";
import type { FindDmDto } from "../../service/api/models/FindDmDto";
import type { RoomResponseDto } from "../../service/api/models/RoomResponseDto";
import type { RoomResDmDto } from "../../service/api/models/RoomResDmDto";
import type { ParticipantResponseDto } from "../../service/api/models/ParticipantResponseDto";
import type { ParticipantTotalResDTO } from "../../service/api/models/ParticipantTotalResDTO";
import type { MessageResponseDto } from "../../service/api/models/MessageResponseDto";
import type { Ack } from "../../service/api/models/Ack";
import useApiCall from "./useApiCall";
import type { UserRoleDto } from "@/service/api";

interface CreateRoomDtoFormData {
  thumbnail?: Blob;
  members: Array<number>;
  owner_id?: number;
  room_type: string;
  name_room?: string;
}

export default function useSocialService() {
  const { call, data, loading, error } = useApiCall();

  const createRoom = (dto: CreateRoomDtoFormData) =>
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
  const getParticipantInstance = (roomId: string) =>
    call<UserRoleDto[]>(() =>
      SocialService.socialControllerGetInstanceParticipant(roomId)
    );

  const getMedia = (roomId: string) =>
    call<MessageResponseDto[]>(() =>
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

  const deleteRoom = (roomId: string) =>
    call<Ack>(() => SocialService.socialControllerDeleteRoom(roomId));

  const deleteMessageByRoom = (roomId: string) =>
    call<Ack>(() => SocialService.socialControllerDeleteMessageByRoom(roomId));

  const deleteMessage = (id: string) =>
    call<Ack>(() => SocialService.socialControllerDeleteMessage(id));

  const getRoomDmByUserId = (userId: number) =>
    call<RoomResDmDto[]>(() =>
      SocialService.socialControllerGetRoomDmByUserId(userId)
    );

  const getRoomGroupJoinedByUserId = (userId: number) =>
    call<RoomResponseDto[]>(() =>
      SocialService.socialControllerGetRoomGroupJoinedByUserId(userId)
    );

  const getRoomGroupAll = () =>
    call<RoomResponseDto[]>(() =>
      SocialService.socialControllerGetRoomGroupAll()
    );

  const getRoomCommunityJoinedByUserId = (userId: number) =>
    call<RoomResponseDto[]>(() =>
      SocialService.socialControllerGetRoomCommunityJoinedByUserId(userId)
    );

  const getRoomCommunityAll = () =>
    call<RoomResponseDto[]>(() =>
      SocialService.socialControllerGetRoomCommunityAll()
    );

  return {
    createRoom,
    getRoomInfo,
    getAllRoomId,
    addUserToRoom,
    removeUserFromRoom,
    updateParticipantRole,
    getTotalParticipants,
    getParticipant,
    getParticipantInstance,
    getMedia,
    sendMessage,
    getMessage,
    findDm,
    deleteRoom,
    deleteMessageByRoom,
    deleteMessage,
    getRoomDmByUserId,
    getRoomGroupJoinedByUserId,
    getRoomGroupAll,
    getRoomCommunityJoinedByUserId,
    getRoomCommunityAll,
    result: data,
    loading,
    error,
  };
}
