import { FileDto } from './file.dto';

export class FullContentDto {
  content_id: number;
  creator_id: number;
  username: string;
  profile_url: string;
  parent_id?: number;
  area_id: number;
  liked?: boolean;

  thumbnail: FileDto | null;
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

  score: number;
}
