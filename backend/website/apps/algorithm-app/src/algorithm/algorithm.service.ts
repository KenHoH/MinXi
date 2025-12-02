import { CONTENT_MSG, HISTORY_MSG } from '@app/common/constants/messageEvent';
import {
  CONTENT_SERVICES,
  HISTORY_SERVICES,
} from '@app/common/constants/services';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { IAlgoService } from '@app/contracts/interfaces/app/IAlgoService';
import { CreateHistoryDto } from '@app/contracts/shared-dto/content/req/CreateHistory.dto';
import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { mapToContent } from 'apps/content-app/src/content/utils/mapToContent';
import { firstValueFrom, max } from 'rxjs';
import { levenshteinDistance } from './utils/levenshtein';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PageContentRes } from '@app/contracts/shared-dto/content/res/page.content.dto';

@Injectable()
export class AlgorithmService implements IAlgoService {
  constructor(
    @Inject(CONTENT_SERVICES.CLIENT)
    private readonly contentClient: ClientProxy,
    @Inject(HISTORY_SERVICES.CLIENT)
    private readonly historyClient: ClientProxy,
  ) {}
  logger = new Logger(AlgorithmService.name);
  async searchContent(
    query: string,
    areaId: number,
  ): Promise<FullContentDto[]> {
    this.logger.log(`Searching content with query: ${query}`);
    try {
      if (!query || query.trim().length === 0) {
        throw httpToRpc(
          new HttpException('Query cannot be empty', HttpStatus.BAD_REQUEST),
        );
      }

      const contents: FullContentDto[] = await firstValueFrom(
        this.contentClient.send(CONTENT_MSG.findAll, areaId),
      );

      if (!contents || contents.length === 0) {
        throw httpToRpc(
          new HttpException('No content found', HttpStatus.NOT_FOUND),
        );
      }

      const queryLower = query.toLowerCase();
      const results = contents
        .map((content) => {
          const title = content.title.toLowerCase();
          const description = (content.description || '').toLowerCase();

          const titleDist = levenshteinDistance(queryLower, title);
          const descDist = levenshteinDistance(queryLower, description);

          const titleSim =
            1 - titleDist / Math.max(queryLower.length, title.length);
          const descSim =
            1 - descDist / Math.max(queryLower.length, description.length || 1);

          const similarity = Math.max(titleSim, descSim);

          return {
            content,
            similarity,
          };
        })
        .filter((item) => item.similarity >= 0.6)
        .sort((a, b) => b.similarity - a.similarity)
        .map((item) => item.content);

      return results;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw httpToRpc(
        new HttpException('Search failed', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async updateScore() {
    this.logger.log(`Updating content scores...`);

    let contents: FullContentDto[] = [];

    contents = await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.findGlobal, {}),
    );

    const contentScores: { content: FullContentDto; score: number }[] =
      contents.map((content) => {
        let score = 0;

        score =
          3 * (content.likes / 100) +
          4 * (content.comments / 100) +
          5 * (content.pins / 20) +
          0.8 * (content.views / 80) -
          6 * (content.reports / 20);
        this.logger.log(`Content ID: ${content.content_id}, Score: ${score}`);
        return {
          content: content,
          score: score,
        };
      });

    await firstValueFrom(
      this.contentClient.send(CONTENT_MSG.updateScore, {
        scores: contentScores.map((cs) => ({
          content_id: cs.content.content_id,
          area_id: cs.content.area_id,
          score: cs.score,
        })),
      }),
    );
    this.logger.log(`Content scores updated successfully.`);
  }

  async findFYP(areaId: number, page: number): Promise<PageContentRes> {
    try {
      const contents: PageContentRes = await firstValueFrom(
        this.contentClient.send(CONTENT_MSG.findAllPage, {
          area_id: areaId,
          page,
          limit: 7,
        }),
      );

      const SCORE_THRESHOLD = 0.5;
      return {
        contents: contents.contents.filter((c) => c.score >= SCORE_THRESHOLD),
        currentPage: contents.currentPage,
      };
    } catch (error) {
      throw httpToRpc(
        new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  }
}
