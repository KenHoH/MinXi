import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ContentService } from './content.service';
import { CONTENT_MSG } from '@app/common/constants/messageEvent';
import { CreatePostDto } from '@app/contracts/shared-dto/content/req/CreatePost.req.dto';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { CreateFileDto } from '@app/contracts/shared-dto/content/req/CreateFile.req.dto';
import { FileRes } from '@app/contracts/shared-dto/content/res/file.res.dto';
import { FileDto } from '@app/contracts/shared-dto/content/res/file.dto';
import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';
import { deltaDto } from '@app/contracts/shared-dto/user/delta.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller()
export class ContentController {
  private readonly logger = new Logger(ContentController.name);

  constructor(private readonly contentService: ContentService) {}

  @MessagePattern(CONTENT_MSG.create)
  async create(@Payload() dto: CreatePostDto): Promise<FullContentDto> {
    this.logger.log('Creating content...');
    return this.contentService.create(dto);
  }

  @MessagePattern(CONTENT_MSG.createFile)
  async createFile(@Payload() dto: CreateFileDto): Promise<FileRes> {
    this.logger.log('Create file...');
    return this.contentService.createFile(dto);
  }

  @MessagePattern(CONTENT_MSG.findAll)
  async findAll(@Payload() area_id: number): Promise<FullContentDto[]> {
    this.logger.log(`Fetching all content for area_id: ${area_id}`);
    return this.contentService.findAll(area_id);
  }

  @MessagePattern(CONTENT_MSG.findOne)
  async findOne(
    @Payload() payload: { content_id: number; area_id: number },
  ): Promise<FullContentDto> {
    this.logger.log(`Fetching content ID ${payload.content_id}`);
    return this.contentService.findOne(payload.content_id, payload.area_id);
  }

  @MessagePattern(CONTENT_MSG.getByUser)
  async getByUser(@Payload() creator_id: number): Promise<FullContentDto[]> {
    this.logger.log(`Fetching content by user ID ${creator_id}`);
    return this.contentService.getByUser(creator_id);
  }

  @MessagePattern(CONTENT_MSG.getByUserAll)
  async getByUserAll(@Payload() creator_id: number): Promise<FullContentDto[]> {
    this.logger.log(`Fetching all content by user ID ${creator_id}`);
    return this.contentService.getByUserAll(creator_id);
  }

  @MessagePattern(CONTENT_MSG.remove)
  async remove(
    @Payload() payload: { content_id: number; area_id: number },
  ): Promise<Ack> {
    this.logger.log(`Removing content ID ${payload.content_id}`);
    return this.contentService.remove(payload.content_id, payload.area_id);
  }

  @MessagePattern(CONTENT_MSG.updateView)
  async updateView(
    @Payload()
    payload: {
      content_id: number;
      area_id: number;
      dto: deltaDto;
    },
  ): Promise<Ack> {
    this.logger.log(`Updating view count for content ${payload.content_id}`);
    return this.contentService.updateView(
      payload.content_id,
      payload.area_id,
      payload.dto,
    );
  }

  @MessagePattern(CONTENT_MSG.updateLike)
  async updateLike(
    @Payload()
    payload: {
      content_id: number;
      area_id: number;
      dto: deltaDto;
    },
  ): Promise<Ack> {
    this.logger.log(`Updating like count for content ${payload.content_id}`);
    return this.contentService.updateLike(
      payload.content_id,
      payload.area_id,
      payload.dto,
    );
  }

  @MessagePattern(CONTENT_MSG.updatePin)
  async updatePin(
    @Payload()
    payload: {
      content_id: number;
      area_id: number;
      dto: deltaDto;
    },
  ): Promise<Ack> {
    this.logger.log(`Updating pin count for content ${payload.content_id}`);
    return this.contentService.updatePin(
      payload.content_id,
      payload.area_id,
      payload.dto,
    );
  }

  @MessagePattern(CONTENT_MSG.updateComment)
  async updateComment(
    @Payload()
    payload: {
      content_id: number;
      area_id: number;
      dto: deltaDto;
    },
  ): Promise<Ack> {
    this.logger.log(`Updating comment count for content ${payload.content_id}`);
    return this.contentService.updateComment(
      payload.content_id,
      payload.area_id,
      payload.dto,
    );
  }

  @MessagePattern(CONTENT_MSG.updateReport)
  async updateReport(
    @Payload()
    payload: {
      content_id: number;
      area_id: number;
      dto: deltaDto;
    },
  ): Promise<Ack> {
    this.logger.log(`Updating report count for content ${payload.content_id}`);
    return this.contentService.updateReport(
      payload.content_id,
      payload.area_id,
      payload.dto,
    );
  }

  @MessagePattern(CONTENT_MSG.setPrivate)
  async setPrivate(
    @Payload() payload: { content_id: number; area_id: number },
  ): Promise<Ack> {
    this.logger.log(`Setting content ${payload.content_id} to private`);
    return this.contentService.setPrivate(payload.content_id, payload.area_id);
  }

  @MessagePattern(CONTENT_MSG.setPublic)
  async setPublic(
    @Payload() payload: { content_id: number; area_id: number },
  ): Promise<Ack> {
    this.logger.log(`Setting content ${payload.content_id} to public`);
    return this.contentService.setPublic(payload.content_id, payload.area_id);
  }

  @MessagePattern(CONTENT_MSG.getFile)
  async getFile(
    @Payload(ValidationPipe) payload: { contentId: number; areaId: number },
  ): Promise<FileDto> {
    this.logger.log(
      `Fetching file for content ${payload.contentId} in area ${payload.areaId}`,
    );
    return this.contentService.getFile(payload.contentId, payload.areaId);
  }

  @MessagePattern(CONTENT_MSG.getFiles)
  async getFiles(
    @Payload(ValidationPipe) payload: { contentId: number; areaId: number },
  ): Promise<FileDto[]> {
    this.logger.log(
      `Fetching all files for content ${payload.contentId} in area ${payload.areaId}`,
    );
    return this.contentService.getFiles(payload.contentId, payload.areaId);
  }

  @MessagePattern(CONTENT_MSG.getFollowingContent)
  async getFollowingContent(
    @Payload() userId: number,
  ): Promise<FullContentDto[]> {
    this.logger.log(`Fetching Following content by user ID ${userId}`);
    return this.contentService.getFollowingContent(userId);
  }

  @MessagePattern(CONTENT_MSG.getFriendContent)
  async getFriendContent(@Payload() userId: number): Promise<FullContentDto[]> {
    this.logger.log(`Fetching Friend content by user ID ${userId}`);
    return this.contentService.getFriendContent(userId);
  }
  @MessagePattern(CONTENT_MSG.getLikedByUser)
  async getLikedByUser(@Payload() userId: number): Promise<FullContentDto[]> {
    this.logger.log(`Fetching Liked content by user ID ${userId}`);
    return this.contentService.getLikedByUser(userId);
  }

  @MessagePattern(CONTENT_MSG.getPinnedByUser)
  async getPinnedByUser(@Payload() userId: number): Promise<FullContentDto[]> {
    this.logger.log(`Fetching Pinned content by user ID ${userId}`);
    return this.contentService.getPinnedByUser(userId);
  }
  @MessagePattern(CONTENT_MSG.getAncestorPost)
  async getAncestorPost(
    @Payload() dto: { contentId: number; areaId: number },
  ): Promise<FullContentDto[]> {
    return this.contentService.getAncestorPost(dto.contentId, dto.areaId);
  }
  @MessagePattern(CONTENT_MSG.getChildPost)
  async getChildPost(@Payload() parentId: number): Promise<FullContentDto[]> {
    this.logger.log(`Fetching child posts for parent ID ${parentId}`);
    return this.contentService.getChildPost(parentId);
  }

  @MessagePattern(CONTENT_MSG.getFullPost)
  async getFullPost(
    @Payload() dto: { contentId: number; areaId: number },
  ): Promise<FullContentDto> {
    return this.contentService.getFullPost(dto.contentId, dto.areaId);
  }
}
