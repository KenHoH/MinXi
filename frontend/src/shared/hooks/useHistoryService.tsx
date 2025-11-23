import { useState, useCallback } from "react";
import { HistoryService, type CreateHistoryDto } from "@/services/api";
import { useToast } from "../context/ToastContext";
import { useLoading } from "../context/LoadingContext";

interface UseHistoryServiceReturn {
  // State - typed DTOs
  historyData: CreateHistoryDto | null;
  historiesData: CreateHistoryDto[] | null;
  error: string | null;
  isLoading: boolean;

  // Methods
  upsertHistory: (dto: CreateHistoryDto) => Promise<CreateHistoryDto>;
  getHistoryByUser: (userId: number) => Promise<CreateHistoryDto[]>;
  resetError: () => void;
}

export default function useHistoryService(): UseHistoryServiceReturn {
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const [historyData, setHistoryData] = useState<CreateHistoryDto | null>(null);
  const [historiesData, setHistoriesData] = useState<CreateHistoryDto[] | null>(
    null
  );
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

  const upsertHistory = useCallback(
    async (dto: CreateHistoryDto): Promise<CreateHistoryDto> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await HistoryService.historyControllerUpsert(dto);
        setHistoryData(result);
        return result;
      } catch (err) {
        handleError(err, "Failed to update history. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError]
  );

  const getHistoryByUser = useCallback(
    async (userId: number): Promise<CreateHistoryDto[]> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await HistoryService.historyControllerGetByUser(userId);
        setHistoriesData(result);
        return result;
      } catch (err) {
        handleError(err, "Failed to fetch history. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  return {
    historyData,
    historiesData,
    error,
    isLoading,
    upsertHistory,
    getHistoryByUser,
    resetError,
  };
}
