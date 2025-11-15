import { CreateHistoryDto } from '@app/contracts/shared-dto/content/req/CreateHistory.dto';

export const mapToCreateHistoryDto = (data: any): CreateHistoryDto => ({
  user_id: Number(data.user_id),
  content_id: Number(data.content_id),
  reps: Number(data.reps ?? 0),
  liked: Boolean(data.liked),
  pinned: Boolean(data.pinned),
});
