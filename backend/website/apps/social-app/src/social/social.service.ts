import { MessageDatabaseConnection } from '@app/common/database/message-database-connection/message-database-connection';
import { SocialDatabaseConnection } from '@app/common/database/social-database-connection/social-database-connection';
import { ISocialService } from '@app/contracts/interfaces/app/ISocialService';
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
import { ParticipantTotalResDTO } from '@app/contracts/shared-dto/social/response/totalParticipantResDTO';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  ParticipantRole,
  RoomType,
} from '../../../../prisma/social/generated/social-client/client';
import { mapRoomToResponse } from './utils/mapToRoom';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { mapParticipantToResponse } from './utils/mapToParticipant';
import { mapMessageToResponse } from './utils/mapToMessage';

@Injectable()
export class SocialService implements ISocialService {
  constructor(
    private readonly socialClient: SocialDatabaseConnection,
    private readonly messageClient: MessageDatabaseConnection,
  ) {}
  logger = new Logger(SocialService.name);

  async createRoom(dto: CreateRoomDto): Promise<RoomResponseDto> {
    this.logger.log(`Creating room with dto: ${JSON.stringify(dto)}`);
    try {
      if (dto.type === RoomType.DIRECT && dto.userIds.length === 2) {
        const existingRoom = await this.findDM({
          targetUserId: dto.userIds[1],
          userId: dto.userIds[0],
        }).catch(() => null);

        if (existingRoom) return existingRoom;
      }
      let roomType: RoomType = dto.type;
      if (dto.userIds.length <= 2) roomType = RoomType.DIRECT;
      const room = await this.socialClient.room.create({
        data: { name: dto.name, type: roomType, pictureUrl: dto.pictureUrl },
      });

      if (dto.ownerId) {
        await this.socialClient.participant.create({
          data: {
            roomId: room.id,
            userId: dto.ownerId,
            role: ParticipantRole.OWNER,
          },
        });
      }

      for (const id of dto.userIds) {
        await this.socialClient.participant.create({
          data: {
            roomId: room.id,
            userId: id,
            role: ParticipantRole.MEMBER,
          },
        });
      }

      return mapRoomToResponse(room);
    } catch (error: any) {
      throw httpToRpc(
        new HttpException(
          error?.message || 'Failed to create room',
          error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getRoomInfo(dto: GetRoomInfoDto): Promise<RoomResponseDto> {
    try {
      const room = await this.socialClient.room.findUnique({
        where: { id: dto.roomId },
      });

      if (!room) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }

      return mapRoomToResponse(room);
    } catch (error: any) {
      throw httpToRpc(
        error instanceof HttpException
          ? error
          : new HttpException(
              'Failed to fetch room info',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
      );
    }
  }

  async getAllRoomID(dto: GetAllRoomsDto): Promise<RoomResponseDto[]> {
    try {
      const entries = await this.socialClient.participant.findMany({
        where: { userId: dto.userId },
        select: { roomId: true },
      });

      const ids = entries.map((p) => p.roomId);

      const rooms = await this.socialClient.room.findMany({
        where: { id: { in: ids } },
      });

      return rooms.map(mapRoomToResponse);
    } catch (error: any) {
      throw httpToRpc(
        new HttpException(
          'Failed to fetch room list',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async addUserToRoom(dto: AddUserToRoomDto): Promise<ParticipantResponseDto> {
    try {
      const participant = await this.socialClient.participant.create({
        data: {
          userId: dto.userId,
          roomId: dto.roomId,
          role: dto.role || ParticipantRole.MEMBER,
        },
      });

      return mapParticipantToResponse(participant);
    } catch (error: any) {
      throw httpToRpc(
        new HttpException(
          'Failed to add user to room',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async removeUserFromRoom(
    dto: RemoveUserFromRoomDto,
  ): Promise<ParticipantResponseDto> {
    try {
      const participant = await this.socialClient.participant.findFirst({
        where: { userId: dto.userId, roomId: dto.roomId },
      });

      if (!participant) {
        throw new HttpException('Participant not found', HttpStatus.NOT_FOUND);
      }

      await this.socialClient.participant.delete({
        where: { id: participant.id },
      });

      return mapParticipantToResponse(participant);
    } catch (error: any) {
      throw httpToRpc(
        error instanceof HttpException
          ? error
          : new HttpException(
              'Failed to remove user from room',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
      );
    }
  }

  async updateParticipantRole(
    dto: UpdateParticipantRoleDto,
  ): Promise<ParticipantResponseDto> {
    try {
      const participant = await this.socialClient.participant.findFirst({
        where: { userId: dto.userId, roomId: dto.roomId },
      });

      if (!participant) {
        throw new HttpException('Participant not found', HttpStatus.NOT_FOUND);
      }

      const updated = await this.socialClient.participant.update({
        where: { id: participant.id },
        data: { role: dto.newRole },
      });

      return mapParticipantToResponse(updated);
    } catch (error: any) {
      throw httpToRpc(
        error instanceof HttpException
          ? error
          : new HttpException(
              'Failed to update participant role',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
      );
    }
  }

  async getTotalParticipant(
    dto: GetTotalParticipantsDto,
  ): Promise<ParticipantTotalResDTO> {
    try {
      const total = await this.socialClient.participant.count({
        where: { roomId: dto.roomId },
      });

      return { roomId: dto.roomId, totalParticipants: total };
    } catch (error: any) {
      throw httpToRpc(
        new HttpException(
          'Failed to get total participants',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getParticipant(roomId: string): Promise<ParticipantResponseDto> {
    try {
      const roomType = await this.socialClient.room.findFirst({
        where: { id: roomId },
      });

      if (!roomType || roomType.type !== RoomType.DIRECT) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }

      const participant = await this.socialClient.participant.findFirst({
        where: { roomId: roomId },
      });
      return mapParticipantToResponse(participant);
    } catch (error) {
      throw new HttpException(
        'Failed to get participant',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getMedia(dto: GetMediaDto): Promise<MessageResponseDto> {
    try {
      const media = await this.messageClient.message.findFirst({
        where: { roomId: dto.roomId, mediaUrl: { not: null } },
        orderBy: { createdAt: 'desc' },
      });

      if (!media) {
        throw new HttpException('No media found', HttpStatus.NOT_FOUND);
      }

      return mapMessageToResponse(media);
    } catch (error: any) {
      throw httpToRpc(
        error instanceof HttpException
          ? error
          : new HttpException(
              'Failed to fetch media',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
      );
    }
  }

  async sendMessage(dto: SendMessageDto): Promise<MessageResponseDto> {
    try {
      this.logger.log(`Sending message with dto: ${JSON.stringify(dto)}`);
      const msg = await this.messageClient.message.create({
        data: {
          roomId: dto.roomId,
          content: dto.content,
          authorId: Number(dto.authorId),
          mediaUrl: dto.mediaUrl,
        },
      });

      return mapMessageToResponse(msg);
    } catch (error: any) {
      this.logger.error(
        `Error sending message: ${error?.message}`,
        error?.stack,
      );
      throw httpToRpc(
        new HttpException(
          error?.message || 'Failed to send message',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getMessage(dto: GetMessagesDto): Promise<MessageResponseDto[]> {
    try {
      const msgs = await this.messageClient.message.findMany({
        where: { roomId: dto.roomId },
        orderBy: { createdAt: 'desc' },
        take: dto.limit ?? 50,
      });

      return msgs.map(mapMessageToResponse);
    } catch (error: any) {
      throw httpToRpc(
        new HttpException(
          'Failed to load messages',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async findDM(dto: FindDmDto): Promise<RoomResponseDto> {
    try {
      const currentUserRooms = await this.socialClient.participant.findMany({
        where: { userId: dto.userId },
        select: { roomId: true },
      });

      const currentIds = currentUserRooms.map((p) => p.roomId);

      if (currentIds.length === 0) {
        throw new HttpException('DM room not found', HttpStatus.NOT_FOUND);
      }

      const targetUserRooms = await this.socialClient.participant.findMany({
        where: { userId: dto.targetUserId, roomId: { in: currentIds } },
        select: { roomId: true },
      });

      const sharedIds = targetUserRooms.map((p) => p.roomId);

      if (sharedIds.length === 0) {
        throw new HttpException(
          'DM room not found between users',
          HttpStatus.NOT_FOUND,
        );
      }

      const room = await this.socialClient.room.findFirst({
        where: { id: { in: sharedIds }, type: RoomType.DIRECT },
      });

      if (!room) {
        throw new HttpException('DM room not found', HttpStatus.NOT_FOUND);
      }

      return mapRoomToResponse(room);
    } catch (error: any) {
      throw httpToRpc(
        error instanceof HttpException
          ? error
          : new HttpException(
              'Failed to find DM',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
      );
    }
  }
}
