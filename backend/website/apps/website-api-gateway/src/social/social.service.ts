import { SOCIAL_MSG } from '@app/common/constants/messageEvent';
import { SOCIAL_SERVICES } from '@app/common/constants/services';
import { ISocialService } from '@app/contracts/interfaces/app/ISocialService';
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
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';
import { UserRoleDto } from '@app/contracts/shared-dto/social/response/userRole.dto';
import { GroupCommunitiesResponseDto } from '@app/contracts/shared-dto/social/response/GroupCommunities.dto';
@Injectable()
export class SocialService implements ISocialService {
  constructor(
    @Inject(SOCIAL_SERVICES.CLIENT) private readonly client: ClientProxy,
  ) {}
  logger = new Logger(SocialService.name);
  getParticipant(roomId: string): Promise<ParticipantResponseDto> {
    return firstValueFrom(
      this.client.send(SOCIAL_MSG.getParticipantDM, roomId),
    );
  }

  async createRoom(dto: CreateRoomDto): Promise<RoomResponseDto> {
    this.logger.log(`Creating room with dto: ${JSON.stringify(dto)}`);
    return firstValueFrom(this.client.send(SOCIAL_MSG.createRoom, dto));
  }
  async getRoomInfo(dto: GetRoomInfoDto): Promise<RoomResponseDto> {
    return firstValueFrom(this.client.send(SOCIAL_MSG.getRoomInfo, dto));
  }

  async getAllRoomID(dto: GetAllRoomsDto): Promise<RoomResponseDto[]> {
    return firstValueFrom(this.client.send(SOCIAL_MSG.getAllRoomID, dto));
  }
  async getGroupFromCommunities(roomId: string): Promise<RoomResponseDto[]> {
    return firstValueFrom(
      this.client.send(SOCIAL_MSG.getAllGroupFromCommunities, roomId),
    );
  }

  async addUserToRoom(dto: AddUserToRoomDto): Promise<ParticipantResponseDto> {
    return firstValueFrom(this.client.send(SOCIAL_MSG.addUserToRoom, dto));
  }

  async addGroupToRoom(
    communitiesId: string,
    groupId: string,
  ): Promise<GroupCommunitiesResponseDto> {
    return firstValueFrom(
      this.client.send(SOCIAL_MSG.addGroupToCommunities, {
        communitiesId,
        groupId,
      }),
    );
  }

  async removeGroupFromCommunities(
    communitiesId: string,
    groupId: string,
  ): Promise<GroupCommunitiesResponseDto> {
    return firstValueFrom(
      this.client.send(SOCIAL_MSG.removeGroupFromCommunities, {
        communitiesId,
        groupId,
      }),
    );
  }

  async removeUserFromRoom(
    dto: RemoveUserFromRoomDto,
  ): Promise<ParticipantResponseDto> {
    return firstValueFrom(this.client.send(SOCIAL_MSG.removeUserFromRoom, dto));
  }

  async updateParticipantRole(
    dto: UpdateParticipantRoleDto,
  ): Promise<ParticipantResponseDto> {
    return firstValueFrom(
      this.client.send(SOCIAL_MSG.updateParticipantRole, dto),
    );
  }

  async getTotalParticipant(
    dto: GetTotalParticipantsDto,
  ): Promise<ParticipantTotalResDTO> {
    return firstValueFrom(
      this.client.send(SOCIAL_MSG.getTotalParticipants, dto),
    );
  }

  async getMedia(dto: GetMediaDto): Promise<MessageResponseDto[]> {
    return firstValueFrom(this.client.send(SOCIAL_MSG.getMedia, dto));
  }

  async sendMessage(dto: SendMessageDto): Promise<MessageResponseDto> {
    return firstValueFrom(this.client.send(SOCIAL_MSG.sendMessage, dto));
  }

  async getMessage(dto: GetMessagesDto): Promise<MessageResponseDto[]> {
    return firstValueFrom(this.client.send(SOCIAL_MSG.getMessage, dto));
  }

  async deleteMessageByRoom(roomId: string): Promise<Ack> {
    return firstValueFrom(
      this.client.send(SOCIAL_MSG.deleteMessageByRoom, roomId),
    );
  }

  async delete(id: string): Promise<Ack> {
    return firstValueFrom(this.client.send(SOCIAL_MSG.deleteMessage, id));
  }

  async deleteRoom(roomId: string): Promise<Ack> {
    return firstValueFrom(this.client.send(SOCIAL_MSG.deleteRoom, roomId));
  }

  async findDM(dto: FindDmDto): Promise<RoomResponseDto> {
    return firstValueFrom(this.client.send(SOCIAL_MSG.findDM, dto));
  }

  async getRoomDMByUserId(userId: number): Promise<RoomResDmDto[]> {
    return firstValueFrom(
      this.client.send(SOCIAL_MSG.getRoomDMByUserId, userId),
    );
  }

  async getRoomGroupJoinedByUserId(userId: number): Promise<RoomResponseDto[]> {
    return firstValueFrom(
      this.client.send(SOCIAL_MSG.getRoomGroupJoinedByUserId, userId),
    );
  }

  async getRoomGroupAll(): Promise<RoomResponseDto[]> {
    return firstValueFrom(this.client.send(SOCIAL_MSG.getRoomGroupAll, {}));
  }

  async getInstanceParticipant(roomId: string): Promise<UserRoleDto[]> {
    return firstValueFrom(
      this.client.send(SOCIAL_MSG.getInstanceParticipant, roomId),
    );
  }

  async getRoomCommunityJoinedByUserId(
    userId: number,
  ): Promise<RoomResponseDto[]> {
    return firstValueFrom(
      this.client.send(SOCIAL_MSG.getRoomCommunityJoinedByUserId, userId),
    );
  }

  async getRoomCommunityAll(): Promise<RoomResponseDto[]> {
    return firstValueFrom(this.client.send(SOCIAL_MSG.getRoomCommunityAll, {}));
  }
}
