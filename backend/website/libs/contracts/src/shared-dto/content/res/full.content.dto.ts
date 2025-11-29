import { FileDto } from './file.dto';

export class FullContentDto {
  content_id: number;
  creator_id: number;
  parent_id?: number;
  area_id: number;

  thumbnail: FileDto;
  contents: FileDto[];

  title: string;
  description: string;
  post_type: string;
  visibilityPrivate: boolean;
  views: number;
  likes: number;
  comments: number;
  pins: number;
  reports: number;
  published_at: Date;
}
