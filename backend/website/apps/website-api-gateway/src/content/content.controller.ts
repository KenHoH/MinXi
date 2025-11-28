import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ParseIntPipe,
  UploadedFiles,
  Logger,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ContentService } from './content.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { MulterConfiguration } from '@app/common/config/multer.config';
import { CreatePostDto } from '@app/contracts/shared-dto/content/req/CreatePost.req.dto';
import { deltaDto } from '@app/contracts/shared-dto/user/delta.dto';
import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';
import { createContentSchema } from './schemas/create-content.schema';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';
import { Public } from '@app/common/decorators/public.decorator';
import { FileDtoReq } from '@app/contracts/shared-dto/content/req/FIleDto.req';
import { FileDto } from '@app/contracts/shared-dto/content/res/file.dto';

@Controller('content')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LogInterceptor)
@ApiBearerAuth()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  private readonly logger = new Logger(ContentController.name);

  @Post()
  @Public()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create content with thumbnail and file uploads',
    required: true,
    schema: createContentSchema,
  })
  @ApiResponse({
    status: 201,
    description: 'Content created successfully',
    type: FullContentDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing required files or fields',
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'contents', maxCount: 5 },
      ],
      MulterConfiguration,
    ),
  )
  async create(
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      contents?: Express.Multer.File[];
    },
    @Body() body: any,
  ): Promise<FullContentDto> {
    const creator_id = parseInt(body.creator_id, 10);
    const area_id = parseInt(body.area_id, 10);
    const parent_id = body.parent_id ? parseInt(body.parent_id, 10) : undefined;
    const title = body.title;
    const description = body.description;
    const post_type = body.post_type;
    const published_at = body.published_at;

    if (isNaN(creator_id) || isNaN(area_id)) {
      throw new BadRequestException(
        'creator_id and area_id must be valid numbers',
      );
    }

    if (!title || !description || !post_type) {
      throw new BadRequestException(
        'title, description, and post_type are required',
      );
    }

    if (!published_at) {
      throw new BadRequestException('published_at is required');
    }

    const publishedDate = new Date(published_at);
    if (isNaN(publishedDate.getTime())) {
      throw new BadRequestException(
        'published_at must be a valid date in ISO 8601 format (e.g., 2024-01-01T00:00:00Z)',
      );
    }

    const thumbnailFile = files.thumbnail ? files.thumbnail[0] : null;

    if (!thumbnailFile) {
      throw new BadRequestException('Thumbnail file is required');
    }

    const thumbnailPath = `http://localhost:3000/uploads/thumbnail/${thumbnailFile.filename}`;

    const posts: FileDtoReq[] =
      files.contents?.map((file) => ({
        content_area_id: area_id,
        type: file.mimetype.startsWith('image/') ? 'image' : 'video',
        filepath: `http://localhost:3000/uploads/content/${file.filename}`,
      })) || [];

    if (posts.length === 0) {
      throw new BadRequestException('At least one content file is required');
    }

    const createDto: CreatePostDto = {
      creator_id,
      area_id,
      parent_id,
      thumbnail: thumbnailPath,
      contents: posts as FileDto[],
      title,
      description,
      post_type,
      published_at: body.published_at,
    };

    return await this.contentService.create(createDto);
  }

  @Public()
  @Get('user/:creator_id')
  getByUser(
    @Param('creator_id', ParseIntPipe) creator_id: number,
  ): Promise<FullContentDto[]> {
    this.logger.log(typeof creator_id);
    return this.contentService.getByUser(creator_id);
  }

  @Public()
  @Get('user/:creator_id/all')
  @ApiResponse({
    status: 200,
    description: 'Get all content by user (including private)',
    type: [FullContentDto],
  })
  getByUserAll(
    @Param('creator_id', ParseIntPipe) creator_id: number,
  ): Promise<FullContentDto[]> {
    this.logger.log(`Fetching all content by user ID ${creator_id}`);
    return this.contentService.getByUserAll(creator_id);
  }

  @Public()
  @Get('user/:userId/following')
  getFollowingContent(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<FullContentDto[]> {
    this.logger.log(typeof userId);
    return this.contentService.getFollowingContent(userId);
  }

  @Public()
  @Get('user/:userId/friends')
  getFriendContent(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<FullContentDto[]> {
    this.logger.log(typeof userId);
    return this.contentService.getFriendContent(userId);
  }

  @Public()
  @Get('user/:userId/liked')
  getLikedByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<FullContentDto[]> {
    this.logger.log(typeof userId);
    return this.contentService.getLikedByUser(userId);
  }

  @Public()
  @Get('user/:userId/pinned')
  getPinnedByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<FullContentDto[]> {
    this.logger.log(typeof userId);
    return this.contentService.getPinnedByUser(userId);
  }

  @Public()
  @Get(':content_id/:area_id/ancestorPost')
  getAncestorPost(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
  ): Promise<FullContentDto[]> {
    return this.contentService.getAncestorPost(content_id, area_id);
  }

  @Public()
  @Get(':content_id/:area_id/fullPost')
  getFullPost(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
  ): Promise<FullContentDto> {
    return this.contentService.getFullPost(content_id, area_id);
  }

  @Public()
  @Get(':area_id')
  findAll(
    @Param('area_id', ParseIntPipe) area_id: number,
  ): Promise<FullContentDto[]> {
    return this.contentService.findAll(area_id);
  }

  @Public()
  @Get(':content_id/:area_id')
  findOne(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
  ): Promise<FullContentDto> {
    return this.contentService.findOne(content_id, area_id);
  }

  @Patch(':content_id/:area_id/view')
  updateView(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
    @Body() dto: deltaDto,
  ): Promise<Ack> {
    return this.contentService.updateView(content_id, area_id, dto);
  }

  @Patch(':content_id/:area_id/like')
  updateLike(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
    @Body() dto: deltaDto,
  ): Promise<Ack> {
    return this.contentService.updateLike(content_id, area_id, dto);
  }

  @Patch(':content_id/:area_id/pin')
  updatePin(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
    @Body() dto: deltaDto,
  ): Promise<Ack> {
    return this.contentService.updatePin(content_id, area_id, dto);
  }

  @Patch(':content_id/:area_id/comment')
  updateComment(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
    @Body() dto: deltaDto,
  ): Promise<Ack> {
    return this.contentService.updateComment(content_id, area_id, dto);
  }

  @Patch(':content_id/:area_id/report')
  updateReport(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
    @Body() dto: deltaDto,
  ): Promise<Ack> {
    return this.contentService.updateReport(content_id, area_id, dto);
  }

  @Patch(':content_id/:area_id/private')
  setPrivate(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
  ): Promise<Ack> {
    return this.contentService.setPrivate(content_id, area_id);
  }

  @Patch(':content_id/:area_id/public')
  setPublic(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
  ): Promise<Ack> {
    return this.contentService.setPublic(content_id, area_id);
  }

  @Delete(':content_id/:area_id')
  remove(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
  ): Promise<Ack> {
    return this.contentService.remove(content_id, area_id);
  }
}
