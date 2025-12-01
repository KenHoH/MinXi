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
import { RoomResDmDto } from '@app/contracts/shared-dto/social/response/RoomResDmDTO';
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
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { USER_SERVICES } from '@app/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USER_MSG } from '@app/common/constants/messageEvent';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';

@Injectable()
export class SocialService implements ISocialService {
  constructor(
    private readonly socialClient: SocialDatabaseConnection,
    private readonly messageClient: MessageDatabaseConnection,
    @Inject(USER_SERVICES.CLIENT) private readonly userClient: ClientProxy,
  ) {}
  logger = new Logger(SocialService.name);

  async createRoom(dto: CreateRoomDto): Promise<RoomResponseDto> {
    this.logger.log(`Creating room with dto: ${JSON.stringify(dto)}`);

    try {
      const { type, userIds, ownerId } = dto;

      if (type === RoomType.DIRECT && userIds.length === 2) {
        const existingRoom = await this.findDM({
          userId: userIds[0],
          targetUserId: userIds[1],
        }).catch(() => null);

        if (existingRoom) return existingRoom;
      }

      let roomType: RoomType = type;
      if (type === RoomType.DIRECT && userIds.length !== 2) {
        throw new HttpException(
          'DIRECT room must have exactly 2 users',
          HttpStatus.BAD_REQUEST,
        );
      }

      const room = await this.socialClient.room.create({
        data: {
          name: dto.name,
          type: roomType,
          pictureUrl: dto.pictureUrl || '',
        },
      });

      const participants = new Map<number, ParticipantRole>();

      if (ownerId) {
        participants.set(ownerId, ParticipantRole.OWNER);
      }

      for (const id of userIds) {
        if (!participants.has(id)) {
          participants.set(id, ParticipantRole.MEMBER);
        }
      }

      await this.socialClient.participant.createMany({
        data: Array.from(participants.entries()).map(([userId, role]) => ({
          userId,
          role,
          roomId: room.id,
        })),
      });

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
          type: dto.type,
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

  async deleteMessageByRoom(roomId: string): Promise<Ack> {
    try {
      await this.messageClient.message.deleteMany({
        where: { roomId: roomId },
      });

      return { Valid: true, Msg: 'Messages deleted successfully' };
    } catch (error: any) {
      throw httpToRpc(
        new HttpException(
          'Failed to delete messages',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async delete(id: string): Promise<Ack> {
    try {
      await this.messageClient.message.delete({
        where: { id: id },
      });

      return { Valid: true, Msg: 'Message deleted successfully' };
    } catch (error: any) {
      throw httpToRpc(
        new HttpException(
          'Failed to delete message',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async deleteRoom(roomId: string): Promise<Ack> {
    try {
      await this.socialClient.$transaction(async (tx) => {
        await tx.participant.deleteMany({
          where: { roomId: roomId },
        });

        await tx.room.delete({
          where: { id: roomId },
        });
      });

      await this.messageClient.message.deleteMany({
        where: { roomId: roomId },
      });

      return { Valid: true, Msg: 'Room deleted successfully' };
    } catch (error: any) {
      throw httpToRpc(
        new HttpException(
          error?.message || 'Failed to delete room',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async findDM(dto: FindDmDto): Promise<RoomResponseDto> {
    try {
      const { userId, targetUserId } = dto;

      const rooms = await this.socialClient.participant.groupBy({
        by: ['roomId'],
        where: {
          userId: { in: [userId, targetUserId] },
        },
        _count: { userId: true },
      });

      const sharedRoomIds = rooms
        .filter((r) => r._count.userId === 2)
        .map((r) => r.roomId);

      if (sharedRoomIds.length === 0) {
        throw new HttpException('DM room not found', HttpStatus.NOT_FOUND);
      }

      const room = await this.socialClient.room.findFirst({
        where: {
          id: { in: sharedRoomIds },
          type: RoomType.DIRECT,
        },
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

  // ============ DM SECTION ============
  async getRoomDMByUserId(userId: number): Promise<RoomResDmDto[]> {
    try {
      const userParticipants = await this.socialClient.participant.findMany({
        where: { userId },
        select: { roomId: true },
      });

      const roomIds = userParticipants.map((p) => p.roomId);

      if (roomIds.length === 0) return [];

      const rooms = await this.socialClient.room.findMany({
        where: {
          id: { in: roomIds },
          type: RoomType.DIRECT,
        },
      });

      const dmRooms: RoomResDmDto[] = [];

      for (const room of rooms) {
        const participants = await this.socialClient.participant.findMany({
          where: { roomId: room.id },
        });

        const participantDetails: UserDto[] = [];
        let failed = false;

        for (const participant of participants) {
          try {
            const user = await firstValueFrom(
              this.userClient.send<UserDto>(
                USER_MSG.findOneById,
                participant.userId,
              ),
            );

            if (!user) {
              failed = true;
              break;
            }

            participantDetails.push(user);
          } catch (err) {
            failed = true;
            break;
          }
        }

        if (failed) {
          continue;
        }

        dmRooms.push({
          ...mapRoomToResponse(room),
          participants: participantDetails,
        });
      }

      return dmRooms;
    } catch (error) {
      throw httpToRpc(
        new HttpException(
          'Failed to fetch DM rooms',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  // ============ GROUP SECTION ============
  async getRoomGroupJoinedByUserId(userId: number): Promise<RoomResponseDto[]> {
    this.logger.log(`Fetching DM rooms for userId: ${userId}`);
    try {
      const participants = await this.socialClient.participant.findMany({
        where: { userId: userId },
        select: { roomId: true },
      });

      const roomIds = participants.map((p) => p.roomId);

      const groupRooms = await this.socialClient.room.findMany({
        where: {
          id: { in: roomIds },
          type: RoomType.GROUP,
        },
      });

      return groupRooms.map(mapRoomToResponse);
    } catch (error: any) {
      throw httpToRpc(
        new HttpException(
          'Failed to fetch group rooms joined by user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getRoomGroupAll(): Promise<RoomResponseDto[]> {
    this.logger.log(`Fetching all group rooms`);
    try {
      const groupRooms = await this.socialClient.room.findMany({
        where: { type: RoomType.GROUP },
      });

      return groupRooms.map(mapRoomToResponse);
    } catch (error: any) {
      throw httpToRpc(
        new HttpException(
          'Failed to fetch all group rooms',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  // ============ COMMUNITY SECTION ============
  async getRoomCommunityJoinedByUserId(
    userId: number,
  ): Promise<RoomResponseDto[]> {
    this.logger.log(`Fetching community rooms for userId: ${userId}`);
    try {
      const participants = await this.socialClient.participant.findMany({
        where: { userId: userId },
        select: { roomId: true },
      });

      const roomIds = participants.map((p) => p.roomId);

      const communityRooms = await this.socialClient.room.findMany({
        where: {
          id: { in: roomIds },
          type: RoomType.COMMUNITY,
        },
      });

      return communityRooms.map(mapRoomToResponse);
    } catch (error: any) {
      throw httpToRpc(
        new HttpException(
          'Failed to fetch community rooms joined by user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getRoomCommunityAll(): Promise<RoomResponseDto[]> {
    this.logger.log(`Fetching all community rooms`);
    try {
      const communityRooms = await this.socialClient.room.findMany({
        where: { type: RoomType.COMMUNITY },
      });

      return communityRooms.map(mapRoomToResponse);
    } catch (error: any) {
      throw httpToRpc(
        new HttpException(
          'Failed to fetch all community rooms',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
}
