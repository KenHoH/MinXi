import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { AlgorithmService } from './algorithm.service';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '@app/common/decorators/public.decorator';

@Controller('algorithm')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LogInterceptor)
@ApiBearerAuth()
export class AlgorithmController {
  constructor(private readonly algorithmService: AlgorithmService) {}

  @Public()
  @Get('fyp')
  async findFYP(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('areaId', ParseIntPipe) areaId: number,
  ) {
    return await this.algorithmService.findFYP(userId, areaId);
  }

  @Public()
  @Get('search')
  async searchContent(
    @Query('query') query: string,
    @Query('areaId', ParseIntPipe) areaId: number,
  ) {
    return await this.algorithmService.searchContent(query, areaId);
  }
}
