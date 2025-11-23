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
} from '@nestjs/common';
import { BoardService } from './board.service';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateBoardDto } from '@app/contracts/shared-dto/board/request/create-board.dto';
import { AddContentDto } from '@app/contracts/shared-dto/board/request/add-content.dto';
import { RemoveContentDto } from '@app/contracts/shared-dto/board/request/remove-content.dto';
import { UpdateContentDto } from '@app/contracts/shared-dto/board/request/update-content.dto';
import { Public } from '@app/common/decorators/public.decorator';
import { BoardDto } from '@app/contracts/shared-dto/board/response/board.dto';
import { Ack } from '@app/contracts/shared-dto/ack.dto';

@Controller('board')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LogInterceptor)
@ApiBearerAuth()
export class BoardController {
  private readonly logger = new Logger(BoardController.name);

  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(@Body() dto: CreateBoardDto): Promise<BoardDto> {
    return this.boardService.create(dto);
  }

  @Patch(':id/private')
  setPrivate(@Param('id', ParseIntPipe) id: number): Promise<Ack> {
    return this.boardService.setPrivate(id);
  }

  @Patch(':id/public')
  setPublic(@Param('id', ParseIntPipe) id: number): Promise<Ack> {
    return this.boardService.setPublic(id);
  }

  @Post(':boardId/content')
  addContent(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() dto: AddContentDto,
  ): Promise<Ack> {
    return this.boardService.addContent(boardId, dto);
  }

  @Delete(':boardId/content')
  removeContent(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() dto: RemoveContentDto,
  ): Promise<Ack> {
    return this.boardService.removeContent(boardId, dto);
  }

  @Patch(':boardId')
  updateContent(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() dto: UpdateContentDto,
  ): Promise<BoardDto> {
    return this.boardService.updateContent(boardId, dto);
  }

  @Delete(':id')
  deleteBoard(@Param('id', ParseIntPipe) id: number): Promise<Ack> {
    return this.boardService.deleteBoard(id);
  }

  @Public()
  @Get('user/:userId')
  getBoardByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<BoardDto[]> {
    return this.boardService.getBoardByUser(userId);
  }
}
