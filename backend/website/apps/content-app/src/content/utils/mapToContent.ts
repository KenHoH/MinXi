import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';

export const mapToContent = (content: any): FullContentDto => ({
  content_id: content.content_id,
  creator_id: content.creator_id,
  parent_id: content.parent_id ?? null,
  title: content.title,
  description: content.description,
  post_type: content.post_type,
  visibilityPrivate: Boolean(content.visibilityPrivate),
  views: Number(content.views ?? 0),
  likes: Number(content.likes ?? 0),
  comments: Number(content.comments ?? 0),
  pins: Number(content.pins ?? 0),
  reports: Number(content.reports ?? 0),
  area_id: content.area_id,
  
});
