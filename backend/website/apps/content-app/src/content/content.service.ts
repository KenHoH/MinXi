import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { IContentService } from '@app/contracts/interfaces/content/IContentService';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { CreateFileDto } from '@app/contracts/shared-dto/content/req/CreateFile.req.dto';
import { CreatePostDto } from '@app/contracts/shared-dto/content/req/CreatePost.req.dto';
import { FileRes } from '@app/contracts/shared-dto/content/res/file.res.dto';
import { FileDto } from '@app/contracts/shared-dto/content/res/file.dto';
import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';
import { deltaDto } from '@app/contracts/shared-dto/user/delta.dto';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { mapToContent } from './utils/mapToContent';
import { CONNECT_SERVICES } from '@app/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CONNECTION_MSG } from '@app/common/constants/messageEvent';

@Injectable()
export class ContentService implements IContentService {
  private readonly logger = new Logger(ContentService.name);
  constructor(
    private readonly prisma: ContentDatabaseConnection,
    @Inject(CONNECT_SERVICES.CLIENT)
    private readonly connectionClient: ClientProxy,
  ) {}

  async getFollowingContent(userId: number): Promise<FullContentDto[]> {
    this.logger.log(`User ${userId} is following`);
    try {
      const followings = await firstValueFrom(
        this.connectionClient.send(CONNECTION_MSG.getFollowingByUser, {
          id: userId,
        }),
      );
      this.logger.log(`User ${userId} is following ${followings.length} users`);
      const followingIds = followings.map((f) => f.follower_id);
      const contents = await this.prisma.content.findMany({
        where: { creator_id: { in: followingIds } },
        orderBy: { created_at: 'desc' },
      });
      return contents.map(mapToContent);
    } catch (error) {
      throw httpToRpc(
        new HttpException(
          'Failed to fetch following contents',
          HttpStatus.NOT_FOUND,
        ),
      );
    }
  }
  async getFriendContent(userId: number): Promise<FullContentDto[]> {
    try {
      const friends = await firstValueFrom(
        this.connectionClient.send(CONNECTION_MSG.getFriendsbyUser, {
          id: userId,
        }),
      );
      const friendIds = friends.map((f) => f.friend_id);
      const contents = await this.prisma.content.findMany({
        where: { creator_id: { in: friendIds } },
        orderBy: { created_at: 'desc' },
      });
      return contents.map(mapToContent);
    } catch (error) {
      throw httpToRpc(
        new HttpException(
          'Failed to fetch friend contents',
          HttpStatus.NOT_FOUND,
        ),
      );
    }
  }

  async create(dto: CreatePostDto): Promise<FullContentDto> {
    if (dto.area_id <= 0 || dto.area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );

    try {
      const content = await this.prisma.content.create({
        data: {
          creator_id: dto.creator_id,
          parent_id: dto.parent_id ?? null,
          title: dto.title,
          description: dto.description,
          post_type: dto.post_type,
          area_id: dto.area_id,
        },
      });
      return mapToContent(content);
    } catch (error) {
      this.logger.error('Failed to create content', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to create content',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async createFile(dto: CreateFileDto): Promise<FileRes> {
    if (dto.area_id <= 0 || dto.area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.file.create({
        data: {
          content_area_id: dto.area_id,
          content_id: dto.content_id,
          filepath: dto.file_path,
          thumbnail: dto.thumbnail,
        },
      });
      return {
        Msg: 'File created successfully',
        Valid: true,
        path: dto.file_path,
      };
    } catch (error) {
      this.logger.error('File upload failed', error.message);
      throw httpToRpc(
        new HttpException(
          'File upload failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async findAll(area_id: number): Promise<FullContentDto[]> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      const contents = await this.prisma.content.findMany({
        where: { area_id },
        orderBy: { content_id: 'asc' },
      });
      return contents.map(mapToContent);
    } catch (error) {
      this.logger.error('Failed to fetch content list', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch content list',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async findOne(content_id: number, area_id: number): Promise<FullContentDto> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      const content = await this.prisma.content.findUnique({
        where: { content_id_area_id: { content_id, area_id } },
      });
      if (!content) {
        throw httpToRpc(
          new HttpException('Content not found', HttpStatus.NOT_FOUND),
        );
      }
      return mapToContent(content);
    } catch (error) {
      this.logger.error('Failed to fetch content', error.message);
      if (error.response) throw error;
      throw httpToRpc(
        new HttpException(
          'Failed to fetch content',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getByUser(creator_id: number): Promise<FullContentDto[]> {
    try {
      const contents = await this.prisma.content.findMany({
        where: { creator_id },
        orderBy: { created_at: 'desc' },
      });
      return contents.map(mapToContent);
    } catch (error) {
      this.logger.error('Failed to fetch user contents', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch user contents',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async remove(content_id: number, area_id: number): Promise<Ack> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.content.delete({
        where: { content_id_area_id: { content_id, area_id } },
      });
      return { Valid: true, Msg: 'Content removed successfully' };
    } catch (error) {
      this.logger.error('Failed to delete content', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to delete content',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async updateView(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.content.update({
        where: {
          content_id_area_id: {
            content_id: content_id,
            area_id: area_id,
          },
        },
        data: { views: { increment: dto.delta } },
      });
      return { Valid: true, Msg: 'View count updated' };
    } catch (error) {
      this.logger.error('Failed to update view count', error);
      throw httpToRpc(
        new HttpException(
          'Failed to update view count',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async updateLike(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.content.update({
        where: {
          content_id_area_id: {
            content_id: content_id,
            area_id: area_id,
          },
        },
        data: { likes: { increment: dto.delta } },
      });
      return { Valid: true, Msg: 'Like count updated' };
    } catch (error) {
      this.logger.error('Failed to update like count', error);
      throw httpToRpc(
        new HttpException(
          'Failed to update like count',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
  }

  async updatePin(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.content.update({
        where: {
          content_id_area_id: {
            content_id: content_id,
            area_id: area_id,
          },
        },
        data: { pins: { increment: dto.delta } },
      });
      return { Valid: true, Msg: 'Pin count updated' };
    } catch (error) {
      this.logger.error('Failed to update pin count', error);
      throw httpToRpc(
        new HttpException('Failed to update pin count', HttpStatus.BAD_REQUEST),
      );
    }
  }

  async updateComment(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.content.update({
        where: {
          content_id_area_id: {
            content_id: content_id,
            area_id: area_id,
          },
        },
        data: { comments: { increment: dto.delta } },
      });
      return { Valid: true, Msg: 'Comment count updated' };
    } catch (error) {
      this.logger.error('Failed to update comment count', error);
      throw httpToRpc(
        new HttpException(
          'Failed to update comment count',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async updateReport(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.content.update({
        where: {
          content_id_area_id: {
            content_id: content_id,
            area_id: area_id,
          },
        },
        data: { reports: { increment: dto.delta } },
      });
      return { Valid: true, Msg: 'Report count updated' };
    } catch (error) {
      this.logger.error('Failed to update report count', error);
      throw httpToRpc(
        new HttpException(
          'Failed to update report count',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async setPrivate(content_id: number, area_id: number): Promise<Ack> {
    try {
      await this.prisma.content.update({
        where: { content_id_area_id: { content_id, area_id } },
        data: { visibilityPrivate: true },
      });
      return { Valid: true, Msg: 'Content set to private' };
    } catch (error) {
      this.logger.error('Failed to set content private', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to set content private',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async setPublic(content_id: number, area_id: number): Promise<Ack> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.content.update({
        where: { content_id_area_id: { content_id, area_id } },
        data: { visibilityPrivate: false },
      });
      return { Valid: true, Msg: 'Content set to public' };
    } catch (error) {
      this.logger.error('Failed to set content public', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to set content public',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getFile(contentId: number, areaId: number): Promise<FileDto> {
    if (areaId <= 0 || areaId > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      const file = await this.prisma.file.findFirst({
        where: {
          content_id: contentId,
          content_area_id: areaId,
        },
      });

      if (!file) {
        throw httpToRpc(
          new HttpException('File not found', HttpStatus.NOT_FOUND),
        );
      }

      return {
        file_id: file.file_id,
        filepath: file.filepath,
        thumbnail: file.thumbnail ?? undefined,
        content_id: file.content_id,
        content_area_id: file.content_area_id,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to fetch file', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch file',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
}
