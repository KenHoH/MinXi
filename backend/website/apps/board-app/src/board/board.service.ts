import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { IBoardService } from '@app/contracts/interfaces/app/IBoardService';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { AddContentDto } from '@app/contracts/shared-dto/board/request/add-content.dto';
import { CreateBoardDto } from '@app/contracts/shared-dto/board/request/create-board.dto';
import { RemoveContentDto } from '@app/contracts/shared-dto/board/request/remove-content.dto';
import { UpdateContentDto } from '@app/contracts/shared-dto/board/request/update-content.dto';
import { BoardDto } from '@app/contracts/shared-dto/board/response/board.dto';
import { ContentIdsResDto } from '@app/contracts/shared-dto/content/res/content-ids.res.dto';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { mapBoardToDto } from './utils/mapBoardToDTO';
import { ClientProxy } from '@nestjs/microservices';
import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';
import { FileDto } from '@app/contracts/shared-dto/content/res/file.dto';
import { CONTENT_MSG, USER_MSG } from '@app/common/constants/messageEvent';
import { firstValueFrom } from 'rxjs';
import {
  CONTENT_SERVICES,
  USER_SERVICES,
} from '@app/common/constants/services';

@Injectable()
export class BoardService implements IBoardService {
  private readonly logger = new Logger(BoardService.name);
  constructor(
    private readonly prisma: ContentDatabaseConnection,
    @Inject(CONTENT_SERVICES.CLIENT)
    private readonly contentClient: ClientProxy,
    @Inject(USER_SERVICES.CLIENT)
    private readonly userClient: ClientProxy,
  ) {}

  private async buildBoardDto(board: any, area_id?: number): Promise<BoardDto> {
    let fullContents: FullContentDto[] = [];

    if (board.contents && board.contents.length > 0 && area_id) {
      try {
        const contentIds = board.contents.map((bc: any) => bc.content_id);
        fullContents = await firstValueFrom(
          this.contentClient.send(CONTENT_MSG.findAll, area_id),
        );
        fullContents = fullContents.filter((content) =>
          contentIds.includes(content.content_id),
        );
      } catch (error) {
        this.logger.warn('Failed to fetch full content details', error.message);
        fullContents = [];
      }
    }

    const boardDto: BoardDto = {
      board_id: board.board_id,
      title: board.title,
      description: board.description,
      creator_id: board.creator_id,
      visibilityPrivate: board.visibilityPrivate,
      created_at: board.created_at,
      updated_at: board.updated_at,
      board_thumbnail: board.board_thumbnail,
      contents: fullContents,
    };
    return boardDto;
  }

  async create(dto: CreateBoardDto): Promise<BoardDto> {
    try {
      const { contents = [], area_id, ...boardData } = dto;

      if (contents.length <= 0) {
        const board = await this.prisma.board.create({
          data: {
            ...boardData,
          },
        });
        const boardDto: BoardDto = {
          board_id: board.board_id,
          title: board.title,
          description: board.description,
          creator_id: board.creator_id,
          visibilityPrivate: board.visibilityPrivate,
          created_at: board.created_at,
          updated_at: board.updated_at,
          board_thumbnail: board.board_thumbnail,
          contents: [] as FullContentDto[],
        };
        return boardDto;
      }

      const result = await this.prisma.$transaction(async (tx) => {
        const board = await tx.board.create({
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

        let fullContents: FullContentDto[] = [];
        if (contents.length > 0) {
          try {
            this.logger.debug(
              `Fetching full content details for area_id: ${area_id}`,
            );
            fullContents = await firstValueFrom(
              this.contentClient.send(CONTENT_MSG.findAll, area_id),
            );
            fullContents = fullContents.filter((content) =>
              contents.includes(content.content_id),
            );
          } catch (error) {
            this.logger.warn(
              'Failed to fetch full content details',
              error.message,
            );
            fullContents = [];
          }
        }

        if (fullContents.length !== contents.length) {
          const foundIds = fullContents.map((c) => c.content_id);
          const missingIds = contents.filter((id) => !foundIds.includes(id));
          this.logger.warn(
            `Content IDs not found: ${JSON.stringify(missingIds)}`,
          );
          throw httpToRpc(
            new HttpException(
              `The following content IDs do not exist: ${missingIds.join(', ')}`,
              HttpStatus.BAD_REQUEST,
            ),
          );
        }

        const boardDto: BoardDto = {
          board_id: board.board_id,
          title: board.title,
          description: board.description,
          creator_id: board.creator_id,
          visibilityPrivate: board.visibilityPrivate,
          created_at: board.created_at,
          updated_at: board.updated_at,
          board_thumbnail: board.board_thumbnail,
          contents: fullContents,
        };
        return boardDto;
      });
      return result;
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

  async addContent(
    boardId: number,
    area_id: number,
    dto: AddContentDto,
  ): Promise<Ack> {
    try {
      const board = await this.prisma.board.findUnique({
        where: { board_id: boardId },
      });

      if (!board) {
        throw httpToRpc(
          new HttpException('Board not found', HttpStatus.NOT_FOUND),
        );
      }

      const contentExists = await this.prisma.content.findUnique({
        where: {
          content_id_area_id: {
            content_id: dto.content_id,
            area_id: area_id,
          },
        },
      });

      if (!contentExists) {
        throw httpToRpc(
          new HttpException(
            `Content with ID ${dto.content_id} does not exist in area ${area_id}`,
            HttpStatus.NOT_FOUND,
          ),
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

  async removeContent(
    boardId: number,
    area_id: number,
    dto: RemoveContentDto,
  ): Promise<Ack> {
    try {
      const board = await this.prisma.board.findUnique({
        where: { board_id: boardId },
      });

      if (!board) {
        throw httpToRpc(
          new HttpException('Board not found', HttpStatus.NOT_FOUND),
        );
      }

      const contentExists = await this.prisma.content.findUnique({
        where: {
          content_id_area_id: {
            content_id: dto.content_id,
            area_id: area_id,
          },
        },
      });

      if (!contentExists) {
        throw httpToRpc(
          new HttpException(
            `Content with ID ${dto.content_id} does not exist in area ${area_id}`,
            HttpStatus.NOT_FOUND,
          ),
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
    area_id: number,
    dto: UpdateContentDto,
  ): Promise<BoardDto> {
    try {
      const board = await this.prisma.board.findUnique({
        where: { board_id: boardId },
        include: {
          contents: true,
        },
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

      return await this.buildBoardDto(updatedBoard, area_id);
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

  async getBoardByUser(userId: number, area_id: number): Promise<BoardDto[]> {
    try {
      const boards = await this.prisma.board.findMany({
        where: {
          creator_id: userId,
        },
        include: {
          contents: true,
        },
      });

      return Promise.all(
        boards.map((board) => this.buildBoardDto(board, area_id)),
      );
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

  async getContentIdsByBoardId(boardId: number): Promise<ContentIdsResDto> {
    try {
      const board = await this.prisma.board.findUnique({
        where: { board_id: boardId },
      });

      if (!board) {
        throw httpToRpc(
          new HttpException('Board not found', HttpStatus.NOT_FOUND),
        );
      }

      const boardContents = await this.prisma.boardContent.findMany({
        where: { board_id: boardId },
        select: { content_id: true },
      });

      const contentIds = boardContents.map((bc) => bc.content_id);

      return {
        Valid: true,
        Msg: 'Content IDs retrieved successfully',
        data: contentIds,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to fetch content IDs for board', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch content IDs for board',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
  async getContentByBoardId(
    boardId: number,
    area_id: number,
  ): Promise<FullContentDto[]> {
    try {
      const result = await this.prisma
        .$transaction(async (tx) => {
          const board = await tx.board.findUnique({
            where: { board_id: boardId },
          });

          if (!board) {
            throw httpToRpc(
              new HttpException('Board not found', HttpStatus.NOT_FOUND),
            );
          }

          const boardContents = await tx.boardContent.findMany({
            where: { board_id: boardId },
            select: { content_id: true },
          });

          if (boardContents.length === 0) {
            return [];
          }

          const contentIds = boardContents.map((bc) => bc.content_id);

          const contents = await tx.content
            .findMany({
              where: {
                AND: [{ content_id: { in: contentIds } }, { area_id: area_id }],
              },
              orderBy: { created_at: 'desc' },
            })
            .catch((error) => {
              this.logger.error(
                'Failed to fetch board contents',
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  'Failed to fetch board contents',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            });

          const allContents: FullContentDto[] = [];

          for (const content of contents) {
            try {
              const files = await tx.file.findMany({
                where: {
                  content_id: content.content_id,
                  content_area_id: content.area_id,
                },
              });

              const thumbnail = files.find((file) => file.type === 'thumbnail');
              if (!thumbnail && content.post_type !== 'post') {
                this.logger.warn(
                  `Content ${content.content_id} missing thumbnail`,
                );
                continue;
              }

              const mappedFiles: FileDto[] = files
                .filter((file) => file.type !== 'thumbnail')
                .map((file) => ({
                  file_id: file.file_id,
                  filepath: file.filepath,
                  content_id: file.content_id,
                  content_area_id: file.content_area_id,
                  type: file.type,
                }));

              const userdata = await firstValueFrom(
                this.userClient.send(USER_MSG.findOne, content.creator_id),
              );

              allContents.push({
                content_id: content.content_id,
                creator_id: content.creator_id,
                parent_id: content.parent_id ?? undefined,
                area_id: content.area_id,
                title: content.title,
                description: content.description,
                post_type: content.post_type,
                published_at: content.published_at,
                visibilityPrivate: content.visibilityPrivate,
                views: content.views,
                likes: content.likes,
                comments: content.comments,
                pins: content.pins,
                reports: content.reports,
                score: content.score,
                thumbnail: thumbnail
                  ? {
                      file_id: thumbnail.file_id,
                      filepath: thumbnail.filepath,
                      content_id: thumbnail.content_id,
                      content_area_id: thumbnail.content_area_id,
                      type: thumbnail.type,
                    }
                  : null,
                contents: mappedFiles,
                profile_url: userdata.profile_picture,
                username: userdata.username,
              });
            } catch (error) {
              this.logger.error(
                `Failed to fetch files for content ${content.content_id}`,
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  `Failed to fetch files for content ${content.content_id}`,
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            }
          }

          return allContents;
        })
        .catch((error) => {
          if (error.status) {
            throw error;
          }
          this.logger.error('Transaction failed', error.message);
          throw httpToRpc(
            new HttpException(
              'Failed to fetch board contents - transaction rolled back',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        });

      return result;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.warn('No board contents found or error occurred');
      return [];
    }
  }
}
