import { BOARD_MSG } from '@app/common/constants/messageEvent';
import { BOARD_SERVICES } from '@app/common/constants/services';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { AddContentDto } from '@app/contracts/shared-dto/board/request/add-content.dto';
import { CreateBoardDto } from '@app/contracts/shared-dto/board/request/create-board.dto';
import { RemoveContentDto } from '@app/contracts/shared-dto/board/request/remove-content.dto';
import { UpdateContentDto } from '@app/contracts/shared-dto/board/request/update-content.dto';
import { BoardDto } from '@app/contracts/shared-dto/board/response/board.dto';
import { ContentIdsResDto } from '@app/contracts/shared-dto/content/res/content-ids.res.dto';
import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BoardService {
  constructor(
    @Inject(BOARD_SERVICES.CLIENT)
    private readonly boardClient: ClientProxy,
  ) {}

  async create(dto: CreateBoardDto): Promise<BoardDto> {
    return await firstValueFrom(this.boardClient.send(BOARD_MSG.create, dto));
  }

  async setPrivate(id: number): Promise<Ack> {
    return await firstValueFrom(
      this.boardClient.send(BOARD_MSG.setPrivate, id),
    );
  }

  async setPublic(id: number): Promise<Ack> {
    return await firstValueFrom(this.boardClient.send(BOARD_MSG.setPublic, id));
  }

  async addContent(
    boardId: number,
    area_id: number,
    dto: AddContentDto,
  ): Promise<Ack> {
    return await firstValueFrom(
      this.boardClient.send(BOARD_MSG.addContent, { boardId, area_id, dto }),
    );
  }

  async removeContent(
    boardId: number,
    area_id: number,
    dto: RemoveContentDto,
  ): Promise<Ack> {
    return await firstValueFrom(
      this.boardClient.send(BOARD_MSG.removeContent, { boardId, area_id, dto }),
    );
  }

  async updateContent(
    boardId: number,
    area_id: number,
    dto: UpdateContentDto,
  ): Promise<BoardDto> {
    return await firstValueFrom(
      this.boardClient.send(BOARD_MSG.updateContent, { boardId, area_id, dto }),
    );
  }

  async deleteBoard(id: number): Promise<Ack> {
    return await firstValueFrom(
      this.boardClient.send(BOARD_MSG.deleteBoard, id),
    );
  }

  async getBoardByUser(userId: number, area_id: number): Promise<BoardDto[]> {
    return await firstValueFrom(
      this.boardClient.send(BOARD_MSG.getBoardByUser, { userId, area_id }),
    );
  }

  async getContentIdsByBoardId(boardId: number): Promise<ContentIdsResDto> {
    return await firstValueFrom(
      this.boardClient.send(BOARD_MSG.getContentIdsByBoardId, { boardId }),
    );
  }
  async getContentByBoardId(
    boardId: number,
    areaId: number,
  ): Promise<FullContentDto[]> {
    return await firstValueFrom(
      this.boardClient.send(BOARD_MSG.getContentByBoardId, { boardId, areaId }),
    );
  }
}
