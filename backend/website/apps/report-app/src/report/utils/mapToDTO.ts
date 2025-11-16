import { ReportDto } from '@app/contracts/shared-dto/report/response';

export const mapReportToDto = (report: any): ReportDto => {
  return {
    id: report.id,
    creatorId: report.creatorId,
    userId: report.userId,
    desc: report.desc,
    type: report.type,
    isActive: report.isActive,
    createdAt: report.createdAt,
  };
};
