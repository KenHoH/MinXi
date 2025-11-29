import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Logger,
  ParseIntPipe,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateBoardDto } from '@app/contracts/shared-dto/board/request/create-board.dto';
import { AddContentDto } from '@app/contracts/shared-dto/board/request/add-content.dto';
import { RemoveContentDto } from '@app/contracts/shared-dto/board/request/remove-content.dto';
import { UpdateContentDto } from '@app/contracts/shared-dto/board/request/update-content.dto';
import { Public } from '@app/common/decorators/public.decorator';
import { BoardDto } from '@app/contracts/shared-dto/board/response/board.dto';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { ContentIdsResDto } from '@app/contracts/shared-dto/content/res/content-ids.res.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer/interceptors/file-fields.interceptor';
import { MulterConfiguration } from '@app/common/config/multer.config';
import { createBoardSchema } from './schemas/create-board.schema';

@Controller('board')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LogInterceptor)
@ApiBearerAuth()
export class BoardController {
  private readonly logger = new Logger(BoardController.name);

  constructor(private readonly boardService: BoardService) {}
  @Public()
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update profile',
    required: true,
    schema: createBoardSchema,
  })
  @ApiResponse({
    status: 201,
    description: 'Board created successfully',
    type: BoardDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing required files or fields',
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'thumbnail', maxCount: 1 }],
      MulterConfiguration,
    ),
  )
  create(
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
    },
    @Body() body: any,
  ): Promise<BoardDto> {
    const creator_id = parseInt(body.creator_id, 10);
    const area_id = parseInt(body.area_id, 10);
    const visibility = body.visibility;
    let contents = body.contents;
    const title = body.title;
    const description = body.description;

    if (isNaN(creator_id) || isNaN(area_id)) {
      throw new BadRequestException(
        'creator_id and area_id must be valid numbers',
      );
    }

    if (!title || !description) {
      throw new BadRequestException('title and description are required');
    }

    const thumbnailFile = files.thumbnail ? files.thumbnail[0] : null;

    if (!thumbnailFile) {
      throw new BadRequestException('Thumbnail file is required');
    }

    if (visibility === undefined) {
      throw new BadRequestException('visibility is required');
    }

    this.logger.log(`Raw contents from body: ${contents}`);

    if (typeof contents === 'string') {
      const contentArray = contents
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '');

      if (contentArray.length > 0) {
        contents = contentArray.map((item) => {
          const num = parseInt(item, 10);
          if (isNaN(num)) {
            throw new BadRequestException(
              `Invalid content ID: "${item}" is not a number`,
            );
          }
          return num;
        });

        this.logger.log(`Parsed contents: ${JSON.stringify(contents)}`);
      } else {
        contents = [];
      }
    } else if (!Array.isArray(contents)) {
      throw new BadRequestException(
        'contents must be an array or comma-separated numbers',
      );
    } else {
      if (!contents.every((item) => typeof item === 'number')) {
        throw new BadRequestException('contents must contain only numbers');
      }
    }

    const dto: CreateBoardDto = {
      creator_id,
      area_id,
      contents,
      title,
      description,
      board_thumbnail: `http://localhost:3000/uploads/thumbnail/${thumbnailFile.filename}`,
      visibilityPrivate: visibility === 'true' || visibility === true,
    };

    return this.boardService.create(dto);
  }

  @Post(':boardId/:area_id/content')
  addContent(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('area_id', ParseIntPipe) area_id: number,
    @Body() dto: AddContentDto,
  ): Promise<Ack> {
    return this.boardService.addContent(boardId, area_id, dto);
  }
  @Patch(':id/private')
  setPrivate(@Param('id', ParseIntPipe) id: number): Promise<Ack> {
    return this.boardService.setPrivate(id);
  }

  @Patch(':id/public')
  setPublic(@Param('id', ParseIntPipe) id: number): Promise<Ack> {
    return this.boardService.setPublic(id);
  }

  @Patch(':boardId/:area_id')
  updateContent(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('area_id', ParseIntPipe) area_id: number,
    @Body() dto: UpdateContentDto,
  ): Promise<BoardDto> {
    return this.boardService.updateContent(boardId, area_id, dto);
  }
  @Public()
  @Get('user/:userId/:area_id')
  getBoardByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('area_id', ParseIntPipe) area_id: number,
  ): Promise<BoardDto[]> {
    return this.boardService.getBoardByUser(userId, area_id);
  }

  @Public()
  @Get(':boardId/content-ids')
  getContentIdsByBoardId(
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<ContentIdsResDto> {
    return this.boardService.getContentIdsByBoardId(boardId);
  }

  @Delete(':boardId/:area_id/content')
  removeContent(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('area_id', ParseIntPipe) area_id: number,
    @Body() dto: RemoveContentDto,
  ): Promise<Ack> {
    return this.boardService.removeContent(boardId, area_id, dto);
  }

  @Delete(':id')
  deleteBoard(@Param('id', ParseIntPipe) id: number): Promise<Ack> {
    return this.boardService.deleteBoard(id);
  }
}
