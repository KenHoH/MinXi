import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';

export interface IAlgoService {
  findFYP(
    userId: number,
    areaId: number,
    page: number,
  ): Promise<FullContentDto[]>;
  searchContent(query: string, areaId: number): Promise<FullContentDto[]>;
}
