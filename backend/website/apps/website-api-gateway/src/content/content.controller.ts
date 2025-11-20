import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  ParseIntPipe,
  UploadedFiles,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ContentService } from './content.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { MulterConfiguration } from '@app/common/config/multer.config';
import { CreatePostDto } from '@app/contracts/shared-dto/content/req/CreatePost.req.dto';
import { deltaDto } from '@app/contracts/shared-dto/user/delta.dto';
import { fileFieldsSchema } from '@app/contracts/shared-dto/schema/fileFieldsSchema';
import { CreateFileDto } from '@app/contracts/shared-dto/content/req/CreateFile.req.dto';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';

@Controller('content')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LogInterceptor)
@ApiBearerAuth()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  private readonly logger = new Logger(ContentController.name);

  @Post()
  create(@Body() dto: CreatePostDto) {
    return this.contentService.create(dto);
  }

  @Post('createFile')
  createFile(@Body() dto: CreateFileDto) {
    return this.contentService.createFile(dto);
  }

  @Post('files')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Uploads a mandatory image and an optional second image or video.',
    schema: fileFieldsSchema,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
      ],
      MulterConfiguration,
    ),
  )
  uploadMultipleFiles(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    const imageFile = files.image ? files.image[0] : null;
    const videoFile = files.video ? files.video[0] : null;

    const mainImagePath = imageFile
      ? `http://localhost:3000/uploads/thumbnail/${imageFile.filename}`
      : null;

    const optionalMediaPath = videoFile
      ? `http://localhost:3000/uploads/content/${videoFile.filename}`
      : null;

    return {
      mainImagePath: mainImagePath,
      optionalMediaPath: optionalMediaPath,
    };
  }

  @Get('user/:creator_id')
  getByUser(@Param('creator_id', ParseIntPipe) creator_id: number) {
    this.logger.log(typeof creator_id);
    return this.contentService.getByUser(creator_id);
  }

  @Get('user/:userId/following')
  getFollowingContent(@Param('userId', ParseIntPipe) userId: number) {
    this.logger.log(typeof userId);
    return this.contentService.getFollowingContent(userId);
  }

  @Get('user/:userId/friends')
  getFriendContent(@Param('userId', ParseIntPipe) userId: number) {
    this.logger.log(typeof userId);
    return this.contentService.getFriendContent(userId);
  }

  @Get(':area_id')
  findAll(@Param('area_id', ParseIntPipe) area_id: number) {
    return this.contentService.findAll(area_id);
  }

  @Get(':content_id/:area_id')
  findOne(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
  ) {
    return this.contentService.findOne(content_id, area_id);
  }

  @Patch(':content_id/:area_id/view')
  updateView(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
    @Body() dto: deltaDto,
  ) {
    return this.contentService.updateView(content_id, area_id, dto);
  }

  @Patch(':content_id/:area_id/like')
  updateLike(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
    @Body() dto: deltaDto,
  ) {
    return this.contentService.updateLike(content_id, area_id, dto);
  }

  @Patch(':content_id/:area_id/pin')
  updatePin(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
    @Body() dto: deltaDto,
  ) {
    return this.contentService.updatePin(content_id, area_id, dto);
  }

  @Patch(':content_id/:area_id/comment')
  updateComment(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
    @Body() dto: deltaDto,
  ) {
    return this.contentService.updateComment(content_id, area_id, dto);
  }

  @Patch(':content_id/:area_id/report')
  updateReport(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
    @Body() dto: deltaDto,
  ) {
    return this.contentService.updateReport(content_id, area_id, dto);
  }

  @Patch(':content_id/:area_id/private')
  setPrivate(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
  ) {
    return this.contentService.setPrivate(content_id, area_id);
  }

  @Patch(':content_id/:area_id/public')
  setPublic(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
  ) {
    return this.contentService.setPublic(content_id, area_id);
  }

  @Delete(':content_id/:area_id')
  remove(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
  ) {
    return this.contentService.remove(content_id, area_id);
  }
}
