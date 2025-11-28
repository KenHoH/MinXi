import { AlgorithmService } from "../../service/api/services/AlgorithmService";
import type { FullContentDto } from "../../service/api/models/FullContentDto";
import useApiCall from "./useApiCall";

export default function useAlgorithmService() {
  const { call, data, loading, error } = useApiCall();

  const findFyp = (userId: number, areaId: number) =>
    call<FullContentDto[]>(() =>
      AlgorithmService.algorithmControllerFindFyp(userId, areaId)
    );

  const searchContent = (query: string, areaId: number) =>
    call<FullContentDto[]>(() =>
      AlgorithmService.algorithmControllerSearchContent(query, areaId)
    );

  return {
    findFyp,
    searchContent,
    result: data,
    loading,
    error,
  };
}
