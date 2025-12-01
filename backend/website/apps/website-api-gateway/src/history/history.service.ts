import { HISTORY_MSG } from '@app/common/constants/messageEvent';
import { HISTORY_SERVICES } from '@app/common/constants/services';
import { IHistoryService } from '@app/contracts/interfaces/history/IHistoryService';
import { CreateHistoryDto } from '@app/contracts/shared-dto/content/req/CreateHistory.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HistoryService implements IHistoryService {
  constructor(
    @Inject(HISTORY_SERVICES.CLIENT) private readonly client: ClientProxy,
  ) {}
  async upsert(dto: CreateHistoryDto): Promise<CreateHistoryDto> {
    return firstValueFrom(this.client.send(HISTORY_MSG.upsert, dto));
  }
  async getByUser(user_id: number): Promise<CreateHistoryDto[]> {
    return firstValueFrom(this.client.send(HISTORY_MSG.getByUser, user_id));
  }
  async getByUserAndContent(
    user_id: number,
    content_id: number,
  ): Promise<CreateHistoryDto[]> {
    return firstValueFrom(
      this.client.send(HISTORY_MSG.getByUserAndContent, {
        user_id,
        content_id,
      }),
    );
  }
}
