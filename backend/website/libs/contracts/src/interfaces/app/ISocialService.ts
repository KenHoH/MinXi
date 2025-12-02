import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { AddUserToRoomDto } from '@app/contracts/shared-dto/social/request/addUserToRoomDTO';
import { CreateRoomDto } from '@app/contracts/shared-dto/social/request/createRoomDTO';
import { FindDmDto } from '@app/contracts/shared-dto/social/request/findDMDTO';
import { GetAllRoomsDto } from '@app/contracts/shared-dto/social/request/getAllRoomDTO';
import { GetMediaDto } from '@app/contracts/shared-dto/social/request/getMediaDTO';
import { GetMessagesDto } from '@app/contracts/shared-dto/social/request/getMessageDTO';
import { GetRoomInfoDto } from '@app/contracts/shared-dto/social/request/getRoomInfoDTO';
import { GetTotalParticipantsDto } from '@app/contracts/shared-dto/social/request/getTotalParticipantDTO';
import { RemoveUserFromRoomDto } from '@app/contracts/shared-dto/social/request/removeUserFromRoomDTO';
import { SendMessageDto } from '@app/contracts/shared-dto/social/request/sendMessageDTO';
import { UpdateParticipantRoleDto } from '@app/contracts/shared-dto/social/request/updateParticipantRoleDTO';
import { MessageResponseDto } from '@app/contracts/shared-dto/social/response/messageResDTO';
import { ParticipantResponseDto } from '@app/contracts/shared-dto/social/response/participantDTO';
import { RoomResponseDto } from '@app/contracts/shared-dto/social/response/RoomResDTO';
import { RoomResDmDto } from '@app/contracts/shared-dto/social/response/RoomResDmDTO';
import { ParticipantTotalResDTO } from '@app/contracts/shared-dto/social/response/totalParticipantResDTO';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';

export interface ISocialService {
  createRoom(dto: CreateRoomDto): Promise<RoomResponseDto>;
  getRoomInfo(dto: GetRoomInfoDto): Promise<RoomResponseDto>;
  getAllRoomID(dto: GetAllRoomsDto): Promise<RoomResponseDto[]>;

  addUserToRoom(dto: AddUserToRoomDto): Promise<ParticipantResponseDto>;
  removeUserFromRoom(
    dto: RemoveUserFromRoomDto,
  ): Promise<ParticipantResponseDto>;
  updateParticipantRole(
    dto: UpdateParticipantRoleDto,
  ): Promise<ParticipantResponseDto>;
  getTotalParticipant(
    dto: GetTotalParticipantsDto,
  ): Promise<ParticipantTotalResDTO>;
  getParticipant(roomId: string): Promise<ParticipantResponseDto>;

  getMedia(dto: GetMediaDto): Promise<MessageResponseDto[]>;
  sendMessage(dto: SendMessageDto): Promise<MessageResponseDto>;
  getMessage(dto: GetMessagesDto): Promise<MessageResponseDto[]>;
  delete(id: string): Promise<Ack>;
  deleteMessageByRoom(roomId: string): Promise<Ack>;
  deleteRoom(roomId: string): Promise<Ack>;
  findDM(dto: FindDmDto): Promise<RoomResponseDto>;

  getInstanceParticipant(roomId: string): Promise<UserDto[]>;

  getRoomDMByUserId(userId: number): Promise<RoomResDmDto[]>;
  getRoomGroupJoinedByUserId(userId: number): Promise<RoomResponseDto[]>;
  getRoomGroupAll(): Promise<RoomResponseDto[]>;
  getRoomCommunityJoinedByUserId(userId: number): Promise<RoomResponseDto[]>;
  getRoomCommunityAll(): Promise<RoomResponseDto[]>;
}
