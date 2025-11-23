import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from '@app/contracts/shared-dto/content/req/CreateHistory.dto';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '@app/common/decorators/public.decorator';

@Controller('history')
@ApiBearerAuth()
@UseInterceptors(LogInterceptor)
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Patch()
  upsert(@Body() dto: CreateHistoryDto): Promise<CreateHistoryDto> {
    return this.historyService.upsert(dto);
  }
  @Public()
  @Get(':user_id')
  getByUser(
    @Param('user_id', ParseIntPipe) user_id: number,
  ): Promise<CreateHistoryDto[]> {
    return this.historyService.getByUser(user_id);
  }
}
