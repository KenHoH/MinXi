import { BOARD_MSG } from '@app/common/constants/messageEvent';
import { BOARD_SERVICES } from '@app/common/constants/services';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { AddContentDto } from '@app/contracts/shared-dto/board/request/add-content.dto';
import { CreateBoardDto } from '@app/contracts/shared-dto/board/request/create-board.dto';
import { RemoveContentDto } from '@app/contracts/shared-dto/board/request/remove-content.dto';
import { UpdateContentDto } from '@app/contracts/shared-dto/board/request/update-content.dto';
import { BoardDto } from '@app/contracts/shared-dto/board/response/board.dto';
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

  async addContent(boardId: number, dto: AddContentDto): Promise<Ack> {
    return await firstValueFrom(
      this.boardClient.send(BOARD_MSG.addContent, { boardId, dto }),
    );
  }

  async removeContent(boardId: number, dto: RemoveContentDto): Promise<Ack> {
    return await firstValueFrom(
      this.boardClient.send(BOARD_MSG.removeContent, { boardId, dto }),
    );
  }

  async updateContent(
    boardId: number,
    dto: UpdateContentDto,
  ): Promise<BoardDto> {
    return await firstValueFrom(
      this.boardClient.send(BOARD_MSG.updateContent, { boardId, dto }),
    );
  }

  async deleteBoard(id: number): Promise<Ack> {
    return await firstValueFrom(
      this.boardClient.send(BOARD_MSG.deleteBoard, id),
    );
  }

  async getBoardByUser(userId: number): Promise<BoardDto[]> {
    return await firstValueFrom(
      this.boardClient.send(BOARD_MSG.getBoardByUser, userId),
    );
  }
}
