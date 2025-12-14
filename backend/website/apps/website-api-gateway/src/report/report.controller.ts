import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from '@app/contracts/shared-dto/report/request';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';

@Controller('report')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LogInterceptor)
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async getAllReports() {
    return await this.reportService.getAllReports();
  }

  @Get('user/:userId')
  async getReportsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.reportService.getReportsByUser(userId);
  }

  @Post()
  async createReport(@Body() dto: CreateReportDto) {
    return await this.reportService.createReport(
      dto.creator_id,
      dto.userId,
      dto.desc,
      dto.type,
    );
  }

  @Post(':id/activate')
  async activateReport(@Param('id', ParseIntPipe) id: number) {
    return await this.reportService.activateReport(id);
  }

  @Post(':id/deactivate')
  async deactivateReport(@Param('id', ParseIntPipe) id: number) {
    return await this.reportService.deactivateReport(id);
  }

  @Delete(':id')
  async deleteReport(@Param('id', ParseIntPipe) id: number) {
    return await this.reportService.deleteReport(id);
  }
}
