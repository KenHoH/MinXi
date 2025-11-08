import { CONTENT_MSG } from '@app/common/constants/messageEvent';
import { CONTENT_SERVICES } from '@app/common/constants/services';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { CreateFileDto } from '@app/contracts/shared-dto/content/req/CreateFile.req.dto';
import { CreatePostDto } from '@app/contracts/shared-dto/content/req/CreatePost.req.dto';
import { FileRes } from '@app/contracts/shared-dto/content/res/file.res.dto';
import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';
import { deltaDto } from '@app/contracts/shared-dto/user/delta.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ContentService {
  constructor(
    @Inject(CONTENT_SERVICES.CLIENT)
    private readonly contentClient: ClientProxy,
  ) {}
  async create(dto: CreatePostDto): Promise<Ack> {
    return await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.create, dto),
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
}
