import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { ReportDto } from '@app/contracts/shared-dto/report';

export interface IReportService {
  getAllReports(): Promise<ReportDto[]>;
  getReportsByUser(userId: number): Promise<ReportDto[]>;
  createReport(
    creator_id: number,
    userId: number,
    desc: string,
    type: string,
  ): Promise<Ack>;
  activateReport(id: number): Promise<Ack>;
  deactivateReport(id: number): Promise<Ack>;
  deleteReport(id: number): Promise<Ack>;
}
