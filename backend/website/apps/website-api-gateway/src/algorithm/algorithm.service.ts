import { ALGO_MSG } from '@app/common/constants/messageEvent';
import { ALGO_SERVICES } from '@app/common/constants/services';
import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AlgorithmService {
  constructor(
    @Inject(ALGO_SERVICES.CLIENT) private readonly algoClient: ClientProxy,
  ) {}

  async findFYP(userId: number, areaId: number): Promise<FullContentDto[]> {
    return await firstValueFrom(
      this.algoClient.send<FullContentDto[]>(ALGO_MSG.findFYP, {
        userId,
        areaId,
      }),
    );
  }

  async searchContent(
    query: string,
    areaId: number,
  ): Promise<FullContentDto[]> {
    return await firstValueFrom(
      this.algoClient.send<FullContentDto[]>(ALGO_MSG.searchContent, {
        query,
        areaId,
      }),
    );
  }
}
