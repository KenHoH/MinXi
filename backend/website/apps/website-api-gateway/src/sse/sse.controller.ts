import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Sse,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { SseService } from './sse.service';
import { BroadcastMsgReq } from '@app/contracts/shared-dto/sse/req/BroadcastMsgReq';
import { Observable } from 'rxjs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { BroadcastNotifReq } from '@app/contracts/shared-dto/sse/req/BroadcastNotifReq';
import { Public } from '@app/common/decorators/public.decorator';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { ConnectionStatsRes } from '@app/contracts/shared-dto/sse/res/ConnectionStatsRes';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer/interceptors/file-fields.interceptor';
import { MulterConfiguration } from '@app/common/config/multer.config';
import { createMetadataSchema } from './schemas/create-metadata.schema';

@Controller('sse')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Public()
  @Sse('subscribe/rooms/:roomId')
  subscribeToRoom(
    @Param('roomId') roomId: string,
  ): Promise<Observable<MessageEvent>> {
    return this.sseService.subscribeToRoom(roomId);
  }

  @Public()
  @Post('sendBroadcastToRoom')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update profile',
    required: true,
    schema: createMetadataSchema,
  })
  @ApiResponse({
    status: 201,
    description: 'send message successfully',
    type: Ack,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing required files or fields',
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'metadata', maxCount: 1 }],
      MulterConfiguration,
    ),
  )
  sendBroadcast(
    @UploadedFiles()
    files: {
      metadata?: Express.Multer.File[];
    },
    @Body() body: any,
  ): Promise<Ack> {
    const roomId = body.room_id;
    const authorId = parseInt(body.author_id, 10);
    const message = body.message;
    const authorName = body.author_name;
    const authorProfileUrl = body.author_profile_url;
    const metadataFile = files.metadata ? files.metadata[0] : null;

    if (!roomId || typeof roomId !== 'string') {
      throw new BadRequestException('room_id must be a valid string');
    }

    if (isNaN(authorId)) {
      throw new BadRequestException('author_id must be a valid number');
    }

    if (!message) {
      throw new BadRequestException('message is required');
    }

    let typeMetadata: string = '';

    let profilePath: string = '';
    if (metadataFile) {
      profilePath = `/api/uploads/metadata/${metadataFile.filename}`;
      typeMetadata = metadataFile.mimetype.startsWith('image/')
        ? 'IMAGE'
        : 'VIDEO';
    }

    const dto: BroadcastMsgReq = {
      roomId: roomId,
      authorId: authorId,
      content: message,
      mediaUrl: profilePath,
      id: '',
      type: typeMetadata,
      authorName: authorName,
      authorProfileUrl: authorProfileUrl,
    };

    return this.sseService.sendBroadcast(dto.roomId, dto);
  }

  @Public()
  @Post('sendNotificationToRoom')
  sendNotification(@Body() dto: BroadcastNotifReq): Promise<Ack> {
    return this.sseService.sendNotification(dto.userId, dto, dto.type);
  }

  @Public()
  @Get('stats')
  getStats(): Promise<ConnectionStatsRes> {
    return this.sseService.getConnectionStats();
  }
}
