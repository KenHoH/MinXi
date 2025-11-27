import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { CreateBoardDto } from '@app/contracts/shared-dto/board/request/create-board.dto';
import { AddContentDto } from '@app/contracts/shared-dto/board/request/add-content.dto';
import { RemoveContentDto } from '@app/contracts/shared-dto/board/request/remove-content.dto';
import { UpdateContentDto } from '@app/contracts/shared-dto/board/request/update-content.dto';
import { BoardDto } from '@app/contracts/shared-dto/board/response/board.dto';
import { ContentIdsResDto } from '@app/contracts/shared-dto/content/res/content-ids.res.dto';

export interface IBoardService {
  create(dto: CreateBoardDto): Promise<BoardDto>;
  setPrivate(id: number): Promise<Ack>;
  setPublic(id: number): Promise<Ack>;
  addContent(
    boardId: number,
    area_id: number,
    dto: AddContentDto,
  ): Promise<Ack>;
  removeContent(
    boardId: number,
    area_id: number,
    dto: RemoveContentDto,
  ): Promise<Ack>;
  updateContent(
    boardId: number,
    area_id: number,
    dto: UpdateContentDto,
  ): Promise<BoardDto>;
  deleteBoard(id: number): Promise<Ack>;
  getBoardByUser(userId: number, area_id: number): Promise<BoardDto[]>;
  getContentIdsByBoardId(boardId: number): Promise<ContentIdsResDto>;
}
