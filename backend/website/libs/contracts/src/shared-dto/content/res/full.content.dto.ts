export class FullContentDto {
  content_id: number;
  creator_id: number;
  parent_id?: number;
  title: string;
  description: string;
  post_type: string;
  visibilityPrivate: boolean;
  views: number;
  likes: number;
  comments: number;
  pins: number;
  reports: number;
  area_id: number;
}
