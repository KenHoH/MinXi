import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AlgorithmService } from './algorithm.service';
import { ALGO_MSG } from '@app/common/constants/messageEvent';
import { FindFYPDto } from '@app/contracts/shared-dto/algorithm';

@Controller()
export class AlgorithmController {
  constructor(private readonly algorithmService: AlgorithmService) {}

  @MessagePattern(ALGO_MSG.findFYP)
  async findFYP(
    @Payload() payload: { userId: number; areaId: number; page: number },
  ) {
    return await this.algorithmService.findFYP(payload.areaId, payload.page);
  }

  @MessagePattern(ALGO_MSG.searchContent)
  async searchContent(@Payload() payload: { query: string; areaId: number }) {
    return await this.algorithmService.searchContent(
      payload.query,
      payload.areaId,
    );
  }
}
