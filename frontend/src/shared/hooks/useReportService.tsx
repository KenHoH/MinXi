import { useState, useCallback } from "react";
import {
  ReportService,
  type CreateReportDto,
  type ReportDto,
  type Ack,
} from "@/services/api";
import { useToast } from "../context/ToastContext";
import { useLoading } from "../context/LoadingContext";

interface UseReportServiceReturn {
  // State - typed DTOs
  reportsData: ReportDto[] | null;
  ackData: Ack | null;
  error: string | null;
  isLoading: boolean;

  // Methods
  getAllReports: () => Promise<ReportDto[]>;
  createReport: (dto: CreateReportDto) => Promise<Ack>;
  getReportsByUser: (userId: number) => Promise<ReportDto[]>;
  activateReport: (id: number) => Promise<Ack>;
  deactivateReport: (id: number) => Promise<Ack>;
  deleteReport: (id: number) => Promise<Ack>;
  resetError: () => void;
}

export default function useReportService(): UseReportServiceReturn {
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const [reportsData, setReportsData] = useState<ReportDto[] | null>(null);
  const [ackData, setAckData] = useState<Ack | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetError = useCallback(() => setError(null), []);

  const handleError = useCallback(
    (err: unknown, defaultMessage: string) => {
      const message = err instanceof Error ? err.message : defaultMessage;
      setError(message);
      showToast(message);
    },
    [showToast]
  );

  const getAllReports = useCallback(async (): Promise<ReportDto[]> => {
    setIsLoading(true);
    showLoading();
    resetError();
    try {
      const result = await ReportService.reportControllerGetAllReports();
      setReportsData(result);
      return result;
    } catch (err) {
      handleError(err, "Failed to fetch reports. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  }, [showLoading, hideLoading, resetError, handleError]);

  const createReport = useCallback(
    async (dto: CreateReportDto): Promise<Ack> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await ReportService.reportControllerCreateReport(dto);
        setAckData(result);
        showToast("Report created successfully");
        return result;
      } catch (err) {
        handleError(err, "Failed to create report. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const getReportsByUser = useCallback(
    async (userId: number): Promise<ReportDto[]> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await ReportService.reportControllerGetReportsByUser(
          userId
        );
        setReportsData(result);
        return result;
      } catch (err) {
        handleError(err, "Failed to fetch user reports. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const activateReport = useCallback(
    async (id: number): Promise<Ack> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await ReportService.reportControllerActivateReport(id);
        setAckData(result);
        showToast("Report activated");
        return result;
      } catch (err) {
        handleError(err, "Failed to activate report. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const deactivateReport = useCallback(
    async (id: number): Promise<Ack> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await ReportService.reportControllerDeactivateReport(id);
        setAckData(result);
        showToast("Report deactivated");
        return result;
      } catch (err) {
        handleError(err, "Failed to deactivate report. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const deleteReport = useCallback(
    async (id: number): Promise<Ack> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await ReportService.reportControllerDeleteReport(id);
        setAckData(result);
        showToast("Report deleted successfully");
        return result;
      } catch (err) {
        handleError(err, "Failed to delete report. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  return {
    reportsData,
    ackData,
    error,
    isLoading,
    getAllReports,
    createReport,
    getReportsByUser,
    activateReport,
    deactivateReport,
    deleteReport,
    resetError,
  };
}
