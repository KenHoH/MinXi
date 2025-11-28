import { CONTENT_MSG } from '@app/common/constants/messageEvent';
import { CONTENT_SERVICES } from '@app/common/constants/services';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { CreateFileDto } from '@app/contracts/shared-dto/content/req/CreateFile.req.dto';
import { CreatePostDto } from '@app/contracts/shared-dto/content/req/CreatePost.req.dto';
import { FileRes } from '@app/contracts/shared-dto/content/res/file.res.dto';
import { FileDto } from '@app/contracts/shared-dto/content/res/file.dto';
import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';
import { deltaDto } from '@app/contracts/shared-dto/user/delta.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IContentService } from '@app/contracts/interfaces/content/IContentService';

@Injectable()
export class ContentService implements IContentService {
  constructor(
    @Inject(CONTENT_SERVICES.CLIENT)
    private readonly contentClient: ClientProxy,
  ) {}
  async getFollowingContent(userId: number): Promise<FullContentDto[]> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.getFollowingContent, userId),
    );
  }
  async getFriendContent(userId: number): Promise<FullContentDto[]> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.getFriendContent, userId),
    );
  }
  async create(dto: CreatePostDto): Promise<FullContentDto> {
    return await firstValueFrom(
      this.contentClient.send<FullContentDto>(CONTENT_MSG.create, dto),
    );
  }

  async createFile(dto: CreateFileDto): Promise<FileRes> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.createFile, dto),
    );
  }

  async findAll(area_id: number): Promise<FullContentDto[]> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.findAll, area_id),
    );
  }

  async findOne(content_id: number, area_id: number): Promise<FullContentDto> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.findOne, { content_id, area_id }),
    );
  }

  async getByUser(creator_id: number): Promise<FullContentDto[]> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.getByUser, creator_id),
    );
  }

  async getByUserAll(creator_id: number): Promise<FullContentDto[]> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.getByUserAll, creator_id),
    );
  }

  async remove(content_id: number, area_id: number): Promise<Ack> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.remove, { content_id, area_id }),
    );
  }

  async updateView(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.updateView, {
        content_id,
        area_id,
        dto,
      }),
    );
  }

  async updateLike(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.updateLike, {
        content_id,
        area_id,
        dto,
      }),
    );
  }

  async updatePin(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.updatePin, {
        content_id,
        area_id,
        dto,
      }),
    );
  }

  async updateComment(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.updateComment, {
        content_id,
        area_id,
        dto,
      }),
    );
  }

  async updateReport(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.updateReport, {
        content_id,
        area_id,
        dto,
      }),
    );
  }

  async setPrivate(content_id: number, area_id: number): Promise<Ack> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.setPrivate, { content_id, area_id }),
    );
  }

  async setPublic(content_id: number, area_id: number): Promise<Ack> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.setPublic, { content_id, area_id }),
    );
  }

  async getFile(contentId: number, areaId: number): Promise<FileDto> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.getFile, { contentId, areaId }),
    );
  }

  async getFiles(contentId: number, areaId: number): Promise<FileDto[]> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.getFiles, { contentId, areaId }),
    );
  }

  async getLikedByUser(userId: number): Promise<FullContentDto[]> {
    return firstValueFrom(
      this.contentClient.send(CONTENT_MSG.getLikedByUser, userId),
    );
  }

  async getPinnedByUser(userId: number): Promise<FullContentDto[]> {
    return firstValueFrom(
      this.contentClient.send(CONTENT_MSG.getPinnedByUser, userId),
    );
  }
  async getAncestorPost(
    contentId: number,
    areaId: number,
  ): Promise<FullContentDto[]> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.getAncestorPost, {
        contentId,
        areaId,
      }),
    );
  }
  async getFullPost(
    contentId: number,
    areaId: number,
  ): Promise<FullContentDto> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.getFullPost, { contentId, areaId }),
    );
  }
}
