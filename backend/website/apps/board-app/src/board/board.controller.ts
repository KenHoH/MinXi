import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BoardService } from './board.service';
import { BOARD_MSG } from '@app/common/constants/messageEvent';
import { CreateBoardDto } from '@app/contracts/shared-dto/board/request/create-board.dto';
import { AddContentDto } from '@app/contracts/shared-dto/board/request/add-content.dto';
import { RemoveContentDto } from '@app/contracts/shared-dto/board/request/remove-content.dto';
import { UpdateContentDto } from '@app/contracts/shared-dto/board/request/update-content.dto';
import { BoardDto } from '@app/contracts/shared-dto/board/response/board.dto';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { ContentIdsResDto } from '@app/contracts/shared-dto/content/res/content-ids.res.dto';

@Controller()
@UsePipes(new ValidationPipe())
export class BoardController {
  private readonly logger = new Logger(BoardController.name);

  constructor(private readonly boardService: BoardService) {}

  @MessagePattern(BOARD_MSG.create)
  async create(@Payload() dto: CreateBoardDto): Promise<BoardDto> {
    return this.boardService.create(dto);
  }

  @MessagePattern(BOARD_MSG.setPrivate)
  async setPrivate(@Payload() id: number): Promise<Ack> {
    return this.boardService.setPrivate(id);
  }

  @MessagePattern(BOARD_MSG.setPublic)
  async setPublic(@Payload() id: number): Promise<Ack> {
    return this.boardService.setPublic(id);
  }

  @MessagePattern(BOARD_MSG.addContent)
  async addContent(
    @Payload() payload: { boardId: number; dto: AddContentDto },
  ): Promise<Ack> {
    return this.boardService.addContent(payload.boardId, payload.dto);
  }

  @MessagePattern(BOARD_MSG.removeContent)
  async removeContent(
    @Payload() payload: { boardId: number; dto: RemoveContentDto },
  ): Promise<Ack> {
    return this.boardService.removeContent(payload.boardId, payload.dto);
  }

  @MessagePattern(BOARD_MSG.updateContent)
  async updateContent(
    @Payload() payload: { boardId: number; dto: UpdateContentDto },
  ): Promise<BoardDto> {
    return this.boardService.updateContent(payload.boardId, payload.dto);
  }

  @MessagePattern(BOARD_MSG.deleteBoard)
  async deleteBoard(@Payload() id: number): Promise<Ack> {
    return this.boardService.deleteBoard(id);
  }

  @MessagePattern(BOARD_MSG.getBoardByUser)
  async getBoardByUser(@Payload() userId: number): Promise<BoardDto[]> {
    return this.boardService.getBoardByUser(userId);
  }

  @MessagePattern(BOARD_MSG.getContentIdsByBoardId)
  async getContentIdsByBoardId(
    @Payload() payload: { boardId: number },
  ): Promise<ContentIdsResDto> {
    return this.boardService.getContentIdsByBoardId(payload.boardId);
  }
}
