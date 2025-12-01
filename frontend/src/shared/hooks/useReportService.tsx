import { ReportService } from "../../service/api/services/ReportService";
import type { CreateReportDto } from "../../service/api/models/CreateReportDto";
import type { ReportDto } from "../../service/api/models/ReportDto";
import type { Ack } from "../../service/api/models/Ack";
import useApiCall from "./useApiCall";

export default function useReportService() {
  const { call, data, loading, error } = useApiCall();

  const getAllReports = () =>
    call<ReportDto[]>(() => ReportService.reportControllerGetAllReports());

  const createReport = (dto: CreateReportDto) =>
    call<Ack>(() => ReportService.reportControllerCreateReport(dto));

  const getReportsByUser = (userId: number) =>
    call<ReportDto[]>(() =>
      ReportService.reportControllerGetReportsByUser(userId)
    );

  const activateReport = (id: number) =>
    call<Ack>(() => ReportService.reportControllerActivateReport(id));

  const deactivateReport = (id: number) =>
    call<Ack>(() => ReportService.reportControllerDeactivateReport(id));

  const deleteReport = (id: number) =>
    call<Ack>(() => ReportService.reportControllerDeleteReport(id));

  return {
    getAllReports,
    createReport,
    getReportsByUser,
    activateReport,
    deactivateReport,
    deleteReport,
    result: data,
    loading,
    error,
  };
}
