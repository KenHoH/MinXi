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
  createRoom(@Payload() dto: CreateRoomDto) {
    this.logger.log(`Creating room with dto: ${JSON.stringify(dto)}`);
    return this.socialService.createRoom(dto);
  }

  @MessagePattern(SOCIAL_MSG.getRoomInfo)
  getRoomInfo(@Payload() dto: GetRoomInfoDto) {
    return this.socialService.getRoomInfo(dto);
  }

  @MessagePattern(SOCIAL_MSG.getAllRoomID)
  getAllRoomID(@Payload() dto: GetAllRoomsDto) {
    return this.socialService.getAllRoomID(dto);
  }

  @MessagePattern(SOCIAL_MSG.addUserToRoom)
  addUserToRoom(@Payload() dto: AddUserToRoomDto) {
    return this.socialService.addUserToRoom(dto);
  }

  @MessagePattern(SOCIAL_MSG.removeUserFromRoom)
  removeUserFromRoom(@Payload() dto: RemoveUserFromRoomDto) {
    return this.socialService.removeUserFromRoom(dto);
  }

  @MessagePattern(SOCIAL_MSG.updateParticipantRole)
  updateParticipantRole(@Payload() dto: UpdateParticipantRoleDto) {
    return this.socialService.updateParticipantRole(dto);
  }

  @MessagePattern(SOCIAL_MSG.getTotalParticipants)
  getTotalParticipants(@Payload() dto: GetTotalParticipantsDto) {
    return this.socialService.getTotalParticipant(dto);
  }

  @MessagePattern(SOCIAL_MSG.sendMessage)
  sendMessage(@Payload() dto: SendMessageDto) {
    return this.socialService.sendMessage(dto);
  }

  @MessagePattern(SOCIAL_MSG.getMessage)
  getMessage(@Payload() dto: GetMessagesDto) {
    return this.socialService.getMessage(dto);
  }

  @MessagePattern(SOCIAL_MSG.findDM)
  findDM(@Payload() dto: FindDmDto) {
    return this.socialService.findDM(dto);
  }

  @MessagePattern(SOCIAL_MSG.getMedia)
  getMedia(@Payload() dto: GetMediaDto) {
    return this.socialService.getMedia(dto);
  }
}
