import { HistoryService } from "../../service/api/services/HistoryService";
import type { CreateHistoryDto } from "../../service/api/models/CreateHistoryDto";
import useApiCall from "./useApiCall";

export default function useHistoryService() {
  const { call, data, loading, error } = useApiCall();

  const upsert = (dto: CreateHistoryDto) =>
    call<CreateHistoryDto>(() => HistoryService.historyControllerUpsert(dto));

  const getByUser = (userId: number) =>
    call<CreateHistoryDto[]>(() =>
      HistoryService.historyControllerGetByUser(userId)
    );
  const getByUserAndContent = (userId: number, contentId: number) =>
    call<CreateHistoryDto>(() =>
      HistoryService.historyControllerGetByUserAndContent(userId, contentId)
    );

  return {
    upsert,
    getByUser,
    getByUserAndContent,
    result: data,
    loading,
    error,
  };
}
