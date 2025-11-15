import { CreateHistoryDto } from '@app/contracts/shared-dto/content/req/CreateHistory.dto';

export interface IHistoryService {
  upsert(dto: CreateHistoryDto): Promise<CreateHistoryDto>;
  getByUser(user_id: number): Promise<CreateHistoryDto[]>;
}
