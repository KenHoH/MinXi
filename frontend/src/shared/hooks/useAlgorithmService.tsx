import { AlgorithmService } from "../../service/api/services/AlgorithmService";
import type { FullContentDto } from "../../service/api/models/FullContentDto";
import useApiCall from "./useApiCall";
import type { PageContentRes } from "@/service/api";

export default function useAlgorithmService() {
  const { call, data, loading, error } = useApiCall();

  const findFyp = (areaId: number, page: number) =>
    call<PageContentRes>(() =>
      AlgorithmService.algorithmControllerFindFyp(areaId, page)
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
