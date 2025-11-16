import { REPORT_MSG } from '@app/common/constants/messageEvent';
import {
  ActivateReportDto,
  CreateReportDto,
  DeactivateReportDto,
  DeleteReportDto,
} from '@app/contracts/shared-dto/report/request';
import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReportService } from './report.service';

@Controller()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @MessagePattern(REPORT_MSG.getAllReports)
  async getAllReports() {
    return await this.reportService.getAllReports();
  }

  @MessagePattern(REPORT_MSG.getReportsByUser)
  async getReportsByUser(@Payload(ValidationPipe) payload: { userId: number }) {
    return await this.reportService.getReportsByUser(payload.userId);
  }

  @MessagePattern(REPORT_MSG.createReport)
  async createReport(@Payload(ValidationPipe) payload: CreateReportDto) {
    return await this.reportService.createReport(
      payload.creator_id,
      payload.userId,
      payload.desc,
      payload.type,
    );
  }

  @MessagePattern(REPORT_MSG.activateReport)
  async activateReport(@Payload(ValidationPipe) payload: ActivateReportDto) {
    return await this.reportService.activateReport(payload.id);
  }

  @MessagePattern(REPORT_MSG.deactivateReport)
  async deactivateReport(
    @Payload(ValidationPipe) payload: DeactivateReportDto,
  ) {
    return await this.reportService.deactivateReport(payload.id);
  }

  @MessagePattern(REPORT_MSG.deleteReport)
  async deleteReport(@Payload(ValidationPipe) payload: DeleteReportDto) {
    return await this.reportService.deleteReport(payload.id);
  }
}
