import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { IHistoryService } from '@app/contracts/interfaces/history/IHistoryService';
import { Ack } from '@app/contracts/shared-dto/ack.dto';

import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';
import { CreateHistoryDto } from '@app/contracts/shared-dto/content/req/CreateHistory.dto';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { mapToCreateHistoryDto } from './utils/mapToHistory';

@Injectable()
export class HistoryService implements IHistoryService {
  constructor(private readonly prisma: ContentDatabaseConnection) {}
  logger = new Logger(HistoryService.name);
  async upsert(dto: CreateHistoryDto): Promise<CreateHistoryDto> {
    try {
      const result = await this.prisma.historyContent.upsert({
        where: {
          user_id_content_id: {
            user_id: dto.user_id,
            content_id: dto.content_id,
          },
        },
        update: {
          liked: dto.liked,
          pinned: dto.pinned,
          reps: { increment: 1 },
        },
        create: {
          user_id: dto.user_id,
          content_id: dto.content_id,
          liked: dto.liked ?? false,
          pinned: dto.pinned ?? false,
          reps: dto.reps ?? 0,
        },
      });

      return {
        content_id: result.content_id,
        user_id: result.user_id,
        liked: result.liked,
        pinned: result.pinned,
        reps: result.reps,
      };
    } catch (error) {
      this.logger.log('Failed to create histories', error.message);
      throw httpToRpc(
        new HttpException('Failed to create histories', HttpStatus.BAD_REQUEST),
      );
    }
  }

  async getByUser(user_id: number): Promise<CreateHistoryDto[]> {
    try {
      const result = await this.prisma.historyContent.findMany({
        where: {
          user_id: user_id,
        },
      });
      return result.map(mapToCreateHistoryDto);
    } catch (error) {
      this.logger.log('Failed to get histories', error.message);
      throw httpToRpc(
        new HttpException('Failed to get histories', HttpStatus.BAD_REQUEST),
      );
    }
  }

  async getByUserAndContent(
    user_id: number,
    content_id: number,
  ): Promise<CreateHistoryDto> {
    try {
      const result = await this.prisma.historyContent.findUnique({
        where: {
          user_id_content_id: {
            user_id: user_id,
            content_id: content_id,
          },
        },
      });
      return mapToCreateHistoryDto(result);
    } catch (error) {
      this.logger.log('Failed to get histories', error.message);
      throw httpToRpc(
        new HttpException('Failed to get histories', HttpStatus.BAD_REQUEST),
      );
    }
  }
}
