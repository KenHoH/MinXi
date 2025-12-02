import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';
import { PageContentRes } from '@app/contracts/shared-dto/content/res/page.content.dto';

export interface IAlgoService {
  findFYP(areaId: number, page: number): Promise<PageContentRes>;
  searchContent(query: string, areaId: number): Promise<FullContentDto[]>;
}
