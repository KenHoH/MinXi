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
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { SocialService } from './social.service';
import {
  CreateRoomDto,
  RoomType,
} from '@app/contracts/shared-dto/social/request/createRoomDTO';
import { AddUserToRoomDto } from '@app/contracts/shared-dto/social/request/addUserToRoomDTO';
import { RemoveUserFromRoomDto } from '@app/contracts/shared-dto/social/request/removeUserFromRoomDTO';
import { UpdateParticipantRoleDto } from '@app/contracts/shared-dto/social/request/updateParticipantRoleDTO';
import { SendMessageDto } from '@app/contracts/shared-dto/social/request/sendMessageDTO';
import { FindDmDto } from '@app/contracts/shared-dto/social/request/findDMDTO';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { Public } from '@app/common/decorators/public.decorator';
import { RoomResponseDto } from '@app/contracts/shared-dto/social/response/RoomResDTO';
import { RoomResDmDto } from '@app/contracts/shared-dto/social/response/RoomResDmDTO';
import { ParticipantResponseDto } from '@app/contracts/shared-dto/social/response/participantDTO';
import { ParticipantTotalResDTO } from '@app/contracts/shared-dto/social/response/totalParticipantResDTO';
import { MessageResponseDto } from '@app/contracts/shared-dto/social/response/messageResDTO';
import { createRoomSchema } from './schemas/create-room.schema';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer/interceptors/file-fields.interceptor';
import { MulterConfiguration } from '@app/common/config/multer.config';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';
import { UserRoleDto } from '@app/contracts/shared-dto/social/response/userRole.dto';
import { GroupFromCommunitiesDto } from '@app/contracts/shared-dto/social/request/GroupToCommunities';
import { GroupCommunitiesResponseDto } from '@app/contracts/shared-dto/social/response/GroupCommunities.dto';

@Controller('social')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  logger = new Logger(SocialController.name);

  @Post('room')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create room ',
    required: true,
    schema: createRoomSchema,
  })
  @ApiResponse({
    status: 201,
    description: 'Content created successfully',
    type: RoomResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing required files or fields',
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'thumbnail', maxCount: 1 }],
      MulterConfiguration,
    ),
  )
  createRoom(
    @UploadedFiles() files: { thumbnail?: Express.Multer.File[] },
    @Body() body: any,
  ): Promise<RoomResponseDto> {
    const owner_id = parseInt(body.owner_id, 10);
    const room_type = body.room_type;
    const name_room = body.name_room;
    let members = body.members;

    const thumbnailFile = files.thumbnail ? files.thumbnail[0] : null;
    this.logger.log('this is the owner id' + owner_id);
    if (isNaN(owner_id) && room_type !== 'DIRECT') {
      throw new BadRequestException('creator_id must be a valid number');
    }
    if (!room_type) {
      throw new BadRequestException('room_type is required');
    }
    this.logger.log(`room_type: ${room_type}`);
    if (
      room_type !== 'DIRECT' &&
      room_type !== 'GROUP' &&
      room_type !== 'COMMUNITY'
    ) {
      throw new BadRequestException('room_type is invalid');
    }

    if (typeof members === 'string') {
      const contentArray = members
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '');

      if (contentArray.length > 0) {
        members = contentArray.map((item) => {
          const num = parseInt(item, 10);
          if (isNaN(num)) {
            throw new BadRequestException(
              `Invalid content ID: "${item}" is not a number`,
            );
          }
          return num;
        });

        this.logger.log(`Parsed members: ${JSON.stringify(members)}`);
      } else {
        members = [];
      }
    } else if (!Array.isArray(members)) {
      throw new BadRequestException(
        'members must be an array or comma-separated numbers',
      );
    } else {
      members = members.map((item) => {
        const num = typeof item === 'string' ? parseInt(item, 10) : item;
        if (isNaN(num)) {
          throw new BadRequestException(
            `Invalid members ID: "${item}" is not a number`,
          );
        }
        return num;
      });
    }

    let url: string = '';
    if (thumbnailFile) {
      url = `/api/uploads/thumbnail/${thumbnailFile.filename}`;
    }

    const dto: CreateRoomDto = {
      pictureUrl: url,
      type: room_type as RoomType,
      userIds: members,
      name: name_room,
      ownerId: owner_id,
    };

    return this.socialService.createRoom(dto);
  }

  @Public()
  @Get('room/:roomId')
  getRoomInfo(@Param('roomId') roomId: string): Promise<RoomResponseDto> {
    return this.socialService.getRoomInfo({ roomId });
  }
  @Public()
  @Get('group/community/instance/:roomId')
  getInstanceParticipant(
    @Param('roomId') roomId: string,
  ): Promise<UserRoleDto[]> {
    return this.socialService.getInstanceParticipant(roomId);
  }
  @Public()
  @Get('comunity/group/:roomId')
  getGroupFromCommunities(
    @Param('roomId') roomId: string,
  ): Promise<RoomResponseDto[]> {
    return this.socialService.getGroupFromCommunities(roomId);
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
  ): Promise<ParticipantResponseDto[]> {
    return this.socialService.addUserToRoom(dto);
  }

  @Delete('room/remove-user')
  removeUserFromRoom(
    @Body() dto: RemoveUserFromRoomDto,
  ): Promise<ParticipantResponseDto> {
    return this.socialService.removeUserFromRoom(dto);
  }

  @Post('communities/add-group')
  addGroupToCommunities(
    @Body() dto: GroupFromCommunitiesDto,
  ): Promise<GroupCommunitiesResponseDto> {
    return this.socialService.addGroupToRoom(dto.communitiesId, dto.groupId);
  }

  @Delete('communities/remove-group')
  removeGroupFromCommunities(
    @Body() dto: GroupFromCommunitiesDto,
  ): Promise<GroupCommunitiesResponseDto> {
    return this.socialService.removeGroupFromCommunities(
      dto.communitiesId,
      dto.groupId,
    );
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
  /**
   * @param roomId
   * @returns
   * @deprecated Use getInstanceParticipant instead
   */
  @Public()
  @Get('room/:roomId/participantDM')
  getParticipant(
    @Param('roomId') roomId: string,
  ): Promise<ParticipantResponseDto> {
    return this.socialService.getParticipant(roomId);
  }

  @Public()
  @Get('room/:roomId/media')
  getMedia(@Param('roomId') roomId: string): Promise<MessageResponseDto[]> {
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
  @Delete('message/:id')
  deleteMessage(@Param('id') id: string): Promise<Ack> {
    return this.socialService.delete(id);
  }

  @Delete('room/:roomId')
  deleteRoom(@Param('roomId') roomId: string): Promise<Ack> {
    return this.socialService.deleteRoom(roomId);
  }

  @Delete('room/:roomId/messages')
  deleteMessageByRoom(@Param('roomId') roomId: string): Promise<Ack> {
    return this.socialService.deleteMessageByRoom(roomId);
  }

  @Public()
  @Get('dm/user/:userId')
  @ApiResponse({
    status: 200,
    description: 'DM rooms with participant user information',
    type: [RoomResDmDto],
  })
  getRoomDMByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<RoomResDmDto[]> {
    return this.socialService.getRoomDMByUserId(userId);
  }

  @Public()
  @Get('group/user/:userId/joined')
  @ApiResponse({
    status: 200,
    description: 'Group rooms joined by user',
    type: [RoomResponseDto],
  })
  getRoomGroupJoinedByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<RoomResponseDto[]> {
    return this.socialService.getRoomGroupJoinedByUserId(userId);
  }

  @Public()
  @Get('group/all')
  @ApiResponse({
    status: 200,
    description: 'All group rooms',
    type: [RoomResponseDto],
  })
  getRoomGroupAll(): Promise<RoomResponseDto[]> {
    return this.socialService.getRoomGroupAll();
  }

  @Public()
  @Get('community/user/:userId/joined')
  @ApiResponse({
    status: 200,
    description: 'Community rooms joined by user',
    type: [RoomResponseDto],
  })
  getRoomCommunityJoinedByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<RoomResponseDto[]> {
    return this.socialService.getRoomCommunityJoinedByUserId(userId);
  }

  @Public()
  @Get('community/all')
  @ApiResponse({
    status: 200,
    description: 'All community rooms',
    type: [RoomResponseDto],
  })
  getRoomCommunityAll(): Promise<RoomResponseDto[]> {
    return this.socialService.getRoomCommunityAll();
  }
}
