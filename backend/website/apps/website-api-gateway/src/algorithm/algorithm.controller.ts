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

@Controller('algorithm')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LogInterceptor)
@ApiBearerAuth()
export class AlgorithmController {
  constructor(private readonly algorithmService: AlgorithmService) {}

  @Get('fyp')
  async findFYP(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('areaId', ParseIntPipe) areaId: number,
  ) {
    return await this.algorithmService.findFYP(userId, areaId);
  }

  @Get('search')
  async searchContent(
    @Query('query') query: string,
    @Query('areaId', ParseIntPipe) areaId: number,
  ) {
    return await this.algorithmService.searchContent(query, areaId);
  }
}
