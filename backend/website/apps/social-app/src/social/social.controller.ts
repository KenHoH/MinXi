import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SocialService } from './social.service';
import { SOCIAL_MSG } from '@app/common/constants/messageEvent';
import { CreateRoomDto } from '@app/contracts/shared-dto/social/request/createRoomDTO';
import { GetRoomInfoDto } from '@app/contracts/shared-dto/social/request/getRoomInfoDTO';
import { GetAllRoomsDto } from '@app/contracts/shared-dto/social/request/getAllRoomDTO';
import { AddUserToRoomDto } from '@app/contracts/shared-dto/social/request/addUserToRoomDTO';
import { RemoveUserFromRoomDto } from '@app/contracts/shared-dto/social/request/removeUserFromRoomDTO';
import { UpdateParticipantRoleDto } from '@app/contracts/shared-dto/social/request/updateParticipantRoleDTO';
import { GetTotalParticipantsDto } from '@app/contracts/shared-dto/social/request/getTotalParticipantDTO';
import { SendMessageDto } from '@app/contracts/shared-dto/social/request/sendMessageDTO';
import { GetMessagesDto } from '@app/contracts/shared-dto/social/request/getMessageDTO';
import { FindDmDto } from '@app/contracts/shared-dto/social/request/findDMDTO';
import { GetMediaDto } from '@app/contracts/shared-dto/social/request/getMediaDTO';

@Controller()
export class SocialController {
  constructor(private readonly socialService: SocialService) {}
  logger = new Logger(SocialService.name);
  @MessagePattern(SOCIAL_MSG.createRoom)
  async createRoom(@Payload() dto: CreateRoomDto) {
    this.logger.log(`Creating room with dto: ${JSON.stringify(dto)}`);
    return this.socialService.createRoom(dto);
  }

  @MessagePattern(SOCIAL_MSG.getRoomInfo)
  async getRoomInfo(@Payload() dto: GetRoomInfoDto) {
    return this.socialService.getRoomInfo(dto);
  }

  @MessagePattern(SOCIAL_MSG.getAllRoomID)
  async getAllRoomID(@Payload() dto: GetAllRoomsDto) {
    return this.socialService.getAllRoomID(dto);
  }

  @MessagePattern(SOCIAL_MSG.addUserToRoom)
  async addUserToRoom(@Payload() dto: AddUserToRoomDto) {
    return this.socialService.addUserToRoom(dto);
  }

  @MessagePattern(SOCIAL_MSG.removeUserFromRoom)
  async removeUserFromRoom(@Payload() dto: RemoveUserFromRoomDto) {
    return this.socialService.removeUserFromRoom(dto);
  }

  @MessagePattern(SOCIAL_MSG.updateParticipantRole)
  async updateParticipantRole(@Payload() dto: UpdateParticipantRoleDto) {
    return this.socialService.updateParticipantRole(dto);
  }

  @MessagePattern(SOCIAL_MSG.getTotalParticipants)
  async getTotalParticipants(@Payload() dto: GetTotalParticipantsDto) {
    return this.socialService.getTotalParticipant(dto);
  }

  @MessagePattern(SOCIAL_MSG.getParticipantDM)
  async getParticipant(@Payload() roomId: string) {
    return this.socialService.getParticipant(roomId);
  }

  @MessagePattern(SOCIAL_MSG.sendMessage)
  async sendMessage(@Payload() dto: SendMessageDto) {
    return this.socialService.sendMessage(dto);
  }

  @MessagePattern(SOCIAL_MSG.getMessage)
  async getMessage(@Payload() dto: GetMessagesDto) {
    return this.socialService.getMessage(dto);
  }

  @MessagePattern(SOCIAL_MSG.deleteMessageByRoom)
  async deleteMessageByRoom(@Payload() roomId: string) {
    return this.socialService.deleteMessageByRoom(roomId);
  }

  @MessagePattern(SOCIAL_MSG.deleteMessage)
  async deleteMessage(@Payload() id: string) {
    return this.socialService.delete(id);
  }

  @MessagePattern(SOCIAL_MSG.deleteRoom)
  async deleteRoom(@Payload() roomId: string) {
    return this.socialService.deleteRoom(roomId);
  }

  @MessagePattern(SOCIAL_MSG.findDM)
  async findDM(@Payload() dto: FindDmDto) {
    return this.socialService.findDM(dto);
  }

  @MessagePattern(SOCIAL_MSG.getMedia)
  async getMedia(@Payload() dto: GetMediaDto) {
    return this.socialService.getMedia(dto);
  }

  @MessagePattern(SOCIAL_MSG.getRoomDMByUserId)
  async getRoomDMByUserId(@Payload() userId: number) {
    return this.socialService.getRoomDMByUserId(userId);
  }

  @MessagePattern(SOCIAL_MSG.getRoomGroupJoinedByUserId)
  async getRoomGroupJoinedByUserId(@Payload() userId: number) {
    return this.socialService.getRoomGroupJoinedByUserId(userId);
  }

  @MessagePattern(SOCIAL_MSG.getRoomGroupAll)
  async getRoomGroupAll() {
    return this.socialService.getRoomGroupAll();
  }

  @MessagePattern(SOCIAL_MSG.getRoomCommunityJoinedByUserId)
  async getRoomCommunityJoinedByUserId(@Payload() userId: number) {
    return this.socialService.getRoomCommunityJoinedByUserId(userId);
  }

  @MessagePattern(SOCIAL_MSG.getRoomCommunityAll)
  async getRoomCommunityAll() {
    return this.socialService.getRoomCommunityAll();
  }
}
