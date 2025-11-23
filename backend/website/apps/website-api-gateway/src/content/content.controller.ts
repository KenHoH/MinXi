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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { MulterConfiguration } from '@app/common/config/multer.config';
import { UploadFilesResDto } from '@app/contracts/shared-dto/content/res/upload-files.res.dto';
import { UploadProfileResDto } from '@app/contracts/shared-dto/content/res/upload-profile.res.dto';
import { UploadImageContentResDto } from '@app/contracts/shared-dto/content/res/upload-image-content.res.dto';
import { CreatePostDto } from '@app/contracts/shared-dto/content/req/CreatePost.req.dto';
import { deltaDto } from '@app/contracts/shared-dto/user/delta.dto';
import { fileFieldsSchema } from '@app/contracts/shared-dto/schema/fileFieldsSchema';
import { CreateFileDto } from '@app/contracts/shared-dto/content/req/CreateFile.req.dto';
import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';
import { FileRes } from '@app/contracts/shared-dto/content/res/file.res.dto';
import { FileDto } from '@app/contracts/shared-dto/content/res/file.dto';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';
import { Public } from '@app/common/decorators/public.decorator';

@Controller('content')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LogInterceptor)
@ApiBearerAuth()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  private readonly logger = new Logger(ContentController.name);

  @Post()
  create(@Body() dto: CreatePostDto): Promise<FullContentDto> {
    return this.contentService.create(dto);
  }

  @Post('createFile')
  createFile(@Body() dto: CreateFileDto): Promise<FileRes> {
    return this.contentService.createFile(dto);
  }

  @Post('files')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Uploads a mandatory image and an optional second image or video.',
    schema: fileFieldsSchema,
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    type: UploadFilesResDto,
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
  ): UploadFilesResDto {
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

  @Post('profile')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Uploads a single image file for profile picture.',
    schema: {
      type: 'object',
      properties: {
        profilePicture: {
          type: 'string',
          format: 'binary',
          description: 'The profile picture image file',
        },
      },
      required: ['profilePicture'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Profile picture uploaded successfully',
    type: UploadProfileResDto,
  })
  @UseInterceptors(FileInterceptor('profilePicture', MulterConfiguration))
  uploadProfile(
    @UploadedFile()
    file: Express.Multer.File,
  ): UploadProfileResDto {
    if (!file) {
      return { profilePicturePath: null };
    }

    const profilePicturePath = `http://localhost:3000/uploads/profile/${file.filename}`;

    return {
      profilePicturePath: profilePicturePath,
    };
  }

  @Post('image-content')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Uploads a thumbnail image and a content image. Both must be image files.',
    schema: {
      type: 'object',
      properties: {
        thumbnail: {
          type: 'string',
          format: 'binary',
          description: 'The thumbnail image file',
        },
        contentImage: {
          type: 'string',
          format: 'binary',
          description: 'The content image file',
        },
      },
      required: ['thumbnail', 'contentImage'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Images uploaded successfully',
    type: UploadImageContentResDto,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'contentImage', maxCount: 1 },
      ],
      MulterConfiguration,
    ),
  )
  uploadImageContent(
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      contentImage?: Express.Multer.File[];
    },
  ): UploadImageContentResDto {
    const thumbnailFile = files.thumbnail ? files.thumbnail[0] : null;
    const contentImageFile = files.contentImage ? files.contentImage[0] : null;

    if (!thumbnailFile || !contentImageFile) {
      return {
        thumbnailPath: null,
        contentImagePath: null,
        error: 'Both thumbnail and contentImage files are required',
      };
    }

    // Validate that both files are images
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const isThumbnailImage = imageTypes.includes(thumbnailFile.mimetype);
    const isContentImageImage = imageTypes.includes(contentImageFile.mimetype);

    if (!isThumbnailImage || !isContentImageImage) {
      return {
        thumbnailPath: null,
        contentImagePath: null,
        error: 'Both files must be image files',
      };
    }

    const thumbnailPath = `http://localhost:3000/uploads/thumbnail/${thumbnailFile.filename}`;
    const contentImagePath = `http://localhost:3000/uploads/content/${contentImageFile.filename}`;

    return {
      thumbnailPath: thumbnailPath,
      contentImagePath: contentImagePath,
    };
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

  @Get('files/:content_id/:area_id')
  getFiles(
    @Param('content_id', ParseIntPipe) content_id: number,
    @Param('area_id', ParseIntPipe) area_id: number,
  ): Promise<FileDto[]> {
    return this.contentService.getFiles(content_id, area_id);
  }
}
