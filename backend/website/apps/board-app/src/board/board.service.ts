import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { IBoardService } from '@app/contracts/interfaces/app/IBoardService';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { AddContentDto } from '@app/contracts/shared-dto/board/request/add-content.dto';
import { CreateBoardDto } from '@app/contracts/shared-dto/board/request/create-board.dto';
import { RemoveContentDto } from '@app/contracts/shared-dto/board/request/remove-content.dto';
import { UpdateContentDto } from '@app/contracts/shared-dto/board/request/update-content.dto';
import { BoardDto } from '@app/contracts/shared-dto/board/response/board.dto';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { mapBoardToDto } from './utils/mapBoardToDTO';

@Injectable()
export class BoardService implements IBoardService {
  private readonly logger = new Logger(BoardService.name);
  constructor(private readonly prisma: ContentDatabaseConnection) {}

  async create(dto: CreateBoardDto): Promise<BoardDto> {
    try {
      const { contents, ...boardData } = dto;

      const board = await this.prisma.board.create({
        data: {
          ...boardData,
          contents: {
            create: contents.map((content_id) => ({
              content_id,
            })),
          },
        },
        include: {
          contents: true,
        },
      });

      return mapBoardToDto(board);
    } catch (error) {
      this.logger.error('Failed to create board', error.message);
      if (error.code === 'P2002') {
        throw httpToRpc(
          new HttpException(
            'Board with this data already exists',
            HttpStatus.CONFLICT,
          ),
        );
      }
      throw httpToRpc(
        new HttpException(
          'Failed to create board',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async setPrivate(id: number): Promise<Ack> {
    try {
      const board = await this.prisma.board.findUnique({
        where: { board_id: id },
      });

      if (!board) {
        throw httpToRpc(
          new HttpException('Board not found', HttpStatus.NOT_FOUND),
        );
      }

      await this.prisma.board.update({
        where: {
          board_id: id,
        },
        data: {
          visibilityPrivate: true,
        },
      });
      return { Valid: true, Msg: 'Board set to private' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to set board private', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to set board private',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async setPublic(id: number): Promise<Ack> {
    try {
      const board = await this.prisma.board.findUnique({
        where: { board_id: id },
      });

      if (!board) {
        throw httpToRpc(
          new HttpException('Board not found', HttpStatus.NOT_FOUND),
        );
      }

      await this.prisma.board.update({
        where: {
          board_id: id,
        },
        data: {
          visibilityPrivate: false,
        },
      });
      return { Valid: true, Msg: 'Board set to public' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to set board public', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to set board public',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async addContent(boardId: number, dto: AddContentDto): Promise<Ack> {
    try {
      const board = await this.prisma.board.findUnique({
        where: { board_id: boardId },
      });

      if (!board) {
        throw httpToRpc(
          new HttpException('Board not found', HttpStatus.NOT_FOUND),
        );
      }

      await this.prisma.boardContent.create({
        data: {
          board_id: boardId,
          content_id: dto.content_id,
        },
      });
      return { Valid: true, Msg: 'Content added to board' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw httpToRpc(
          new HttpException(
            'Content already exists in this board',
            HttpStatus.CONFLICT,
          ),
        );
      }
      this.logger.error('Failed to add content to board', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to add content to board',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async removeContent(boardId: number, dto: RemoveContentDto): Promise<Ack> {
    try {
      const board = await this.prisma.board.findUnique({
        where: { board_id: boardId },
      });

      if (!board) {
        throw httpToRpc(
          new HttpException('Board not found', HttpStatus.NOT_FOUND),
        );
      }

      const result = await this.prisma.boardContent.deleteMany({
        where: {
          board_id: boardId,
          content_id: dto.content_id,
        },
      });

      if (result.count === 0) {
        throw httpToRpc(
          new HttpException(
            'Content not found in this board',
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      return { Valid: true, Msg: 'Content removed from board' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to remove content from board', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to remove content from board',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async updateContent(
    boardId: number,
    dto: UpdateContentDto,
  ): Promise<BoardDto> {
    try {
      const board = await this.prisma.board.findUnique({
        where: { board_id: boardId },
      });

      if (!board) {
        throw httpToRpc(
          new HttpException('Board not found', HttpStatus.NOT_FOUND),
        );
      }

      const updatedBoard = await this.prisma.board.update({
        where: {
          board_id: boardId,
        },
        data: {
          ...(dto.title && { title: dto.title }),
          ...(dto.description && { description: dto.description }),
        },
        include: {
          contents: true,
        },
      });
      return mapBoardToDto(updatedBoard);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to update board content', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to update board content',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async deleteBoard(id: number): Promise<Ack> {
    try {
      const board = await this.prisma.board.findUnique({
        where: { board_id: id },
      });

      if (!board) {
        throw httpToRpc(
          new HttpException('Board not found', HttpStatus.NOT_FOUND),
        );
      }

      await this.prisma.board.delete({
        where: {
          board_id: id,
        },
      });
      return { Valid: true, Msg: 'Board deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to delete board', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to delete board',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getBoardByUser(userId: number): Promise<BoardDto[]> {
    try {
      const boards = await this.prisma.board.findMany({
        where: {
          creator_id: userId,
        },
        include: {
          contents: true,
        },
      });
      return boards.map((board) => mapBoardToDto(board));
    } catch (error) {
      this.logger.error('Failed to fetch boards by user', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch boards by user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
}
