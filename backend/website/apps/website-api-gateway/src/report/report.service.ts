import { REPORT_MSG } from '@app/common/constants/messageEvent';
import {
  ActivateReportDto,
  CreateReportDto,
  DeactivateReportDto,
  DeleteReportDto,
} from '@app/contracts/shared-dto/report/request';
import { ReportDto } from '@app/contracts/shared-dto/report/response';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { REPORT_SERVICES } from '@app/common/constants/services';

@Injectable()
export class ReportService {
  constructor(
    @Inject(REPORT_SERVICES.CLIENT) private readonly reportClient: ClientProxy,
  ) {}

  async getAllReports(): Promise<ReportDto[]> {
    return await firstValueFrom(
      this.reportClient.send<ReportDto[]>(REPORT_MSG.getAllReports, {}),
    );
  }

  async getReportsByUser(userId: number): Promise<ReportDto[]> {
    return await firstValueFrom(
      this.reportClient.send<ReportDto[]>(REPORT_MSG.getReportsByUser, {
        userId,
      }),
    );
  }

  async createReport(
    creator_id: number,
    userId: number,
    desc: string,
    type: string,
  ): Promise<Ack> {
    return await firstValueFrom(
      this.reportClient.send<Ack>(REPORT_MSG.createReport, {
        creator_id,
        userId,
        desc,
        type,
      }),
    );
  }

  async activateReport(id: number): Promise<Ack> {
    return await firstValueFrom(
      this.reportClient.send<Ack>(REPORT_MSG.activateReport, { id }),
    );
  }

  async deactivateReport(id: number): Promise<Ack> {
    return await firstValueFrom(
      this.reportClient.send<Ack>(REPORT_MSG.deactivateReport, { id }),
    );
  }

  async deleteReport(id: number): Promise<Ack> {
    return await firstValueFrom(
      this.reportClient.send<Ack>(REPORT_MSG.deleteReport, { id }),
    );
  }
}
