import { FullContentDto } from './full.content.dto';

export class PageContentRes {
  contents: FullContentDto[];
  currentPage: number;
  area_id?: number;
}
