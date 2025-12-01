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
  async findFYP(
    userId: number,
    areaId: number,
    page: number,
  ): Promise<FullContentDto[]> {
    try {
      this.logger.error(`Finding FYP for user ${userId} in area ${areaId}`);
      const contents: FullContentDto[] = await firstValueFrom(
        this.contentClient.send(CONTENT_MSG.findAllPage, {
          area_id: areaId,
          page,
          limit: 10,
        }),
      );

      this.logger.error(`Total contents fetched: ${contents.length}`);

      const history: CreateHistoryDto[] = await firstValueFrom(
        this.historyClient.send(HISTORY_MSG.getByUser, userId),
      );

      this.logger.error(`User history fetched: ${history.length}`);

      if (contents.length === 0 || contents == null || contents === undefined) {
        throw httpToRpc(
          new HttpException('No content found', HttpStatus.NOT_FOUND),
        );
      }

      const contentScores: { content: FullContentDto; score: number }[] =
        contents
          .filter((content) => content.visibilityPrivate === false)
          .map((content) => {
            let score = 0;

            let exist = history.find(
              (h) => h.content_id === content.content_id,
            );
            score =
              3 * (content.likes / 100) +
              4 * (content.comments / 50) +
              5 * (content.pins / 20) +
              0.3 * (content.views / 500) -
              8 * (content.reports / 20) -
              4 * ((exist?.reps ?? 0) / 10);
            this.logger.log(
              `Content ID: ${content.content_id}, Score: ${score}`,
            );
            return {
              content: content,
              score: score,
            };
          });

      contentScores.sort((a, b) => b.score - a.score);
      const SCORE_THRESHOLD = 10;

      return contentScores
        .filter((cs) => cs.score > SCORE_THRESHOLD)
        .map((cs) => mapToContent(cs.content));
    } catch (error) {
      throw httpToRpc(
        new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  }
}
