import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SocialService } from './social.service';
import { CreateRoomDto } from '@app/contracts/shared-dto/social/request/createRoomDTO';
import { AddUserToRoomDto } from '@app/contracts/shared-dto/social/request/addUserToRoomDTO';
import { RemoveUserFromRoomDto } from '@app/contracts/shared-dto/social/request/removeUserFromRoomDTO';
import { UpdateParticipantRoleDto } from '@app/contracts/shared-dto/social/request/updateParticipantRoleDTO';
import { SendMessageDto } from '@app/contracts/shared-dto/social/request/sendMessageDTO';
import { FindDmDto } from '@app/contracts/shared-dto/social/request/findDMDTO';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { Public } from '@app/common/decorators/public.decorator';
import { RoomResponseDto } from '@app/contracts/shared-dto/social/response/RoomResDTO';
import { ParticipantResponseDto } from '@app/contracts/shared-dto/social/response/participantDTO';
import { ParticipantTotalResDTO } from '@app/contracts/shared-dto/social/response/totalParticipantResDTO';
import { MessageResponseDto } from '@app/contracts/shared-dto/social/response/messageResDTO';

@Controller('social')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SocialController {
  constructor(private readonly socialService: SocialService) {}
  @Post('room')
  createRoom(@Body() dto: CreateRoomDto): Promise<RoomResponseDto> {
    return this.socialService.createRoom(dto);
  }

  @Public()
  @Get('room/:roomId')
  getRoomInfo(@Param('roomId') roomId: string): Promise<RoomResponseDto> {
    return this.socialService.getRoomInfo({ roomId });
  }

  @Public()
  @Get('rooms/user/:userId')
  getAllRoomID(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<RoomResponseDto[]> {
    return this.socialService.getAllRoomID({ userId });
  }

  @Post('room/add-user')
  addUserToRoom(
    @Body() dto: AddUserToRoomDto,
  ): Promise<ParticipantResponseDto> {
    return this.socialService.addUserToRoom(dto);
  }

  @Delete('room/remove-user')
  removeUserFromRoom(
    @Body() dto: RemoveUserFromRoomDto,
  ): Promise<ParticipantResponseDto> {
    return this.socialService.removeUserFromRoom(dto);
  }

  @Patch('room/update-role')
  updateParticipantRole(
    @Body() dto: UpdateParticipantRoleDto,
  ): Promise<ParticipantResponseDto> {
    return this.socialService.updateParticipantRole(dto);
  }

  @Public()
  @Get('room/:roomId/participants')
  getTotalParticipants(
    @Param('roomId') roomId: string,
  ): Promise<ParticipantTotalResDTO> {
    return this.socialService.getTotalParticipant({ roomId });
  }

  @Public()
  @Get('room/:roomId/participantDM')
  getParticipant(
    @Param('roomId') roomId: string,
  ): Promise<ParticipantResponseDto> {
    return this.socialService.getParticipant(roomId);
  }

  @Public()
  @Get('room/:roomId/media')
  getMedia(@Param('roomId') roomId: string): Promise<MessageResponseDto> {
    return this.socialService.getMedia({ roomId });
  }

  @Post('message')
  sendMessage(@Body() dto: SendMessageDto): Promise<MessageResponseDto> {
    return this.socialService.sendMessage(dto);
  }

  @Public()
  @Get('room/:roomId/messages')
  getMessage(
    @Param('roomId') roomId: string,
    @Query('limit') limit?: number,
  ): Promise<MessageResponseDto[]> {
    return this.socialService.getMessage({
      roomId,
      limit: limit ? Number(limit) : 50,
    });
  }

  @Post('dm/find')
  findDM(@Body() dto: FindDmDto): Promise<RoomResponseDto> {
    return this.socialService.findDM(dto);
  }
}
