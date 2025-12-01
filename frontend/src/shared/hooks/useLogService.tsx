import { LogService } from "../../service/api/services/LogService";
import type { LogReq } from "../../service/api/models/LogReq";
import type { UserLog } from "../../service/api/models/UserLog";
import useApiCall from "./useApiCall";

export default function useLogService() {
  const { call, data, loading, error } = useApiCall();

  const findByDate = (date: string) =>
    call<UserLog[]>(() => LogService.logControllerFindByDate(date));

  const create = (id: number, dto: LogReq) =>
    call<Record<string, any>>(() => LogService.logControllerCreate(id, dto));

  const findOne = (id: number) =>
    call<UserLog[]>(() => LogService.logControllerFindOne(id));

  const findAll = () =>
    call<UserLog[]>(() => LogService.logControllerFindAll());

  const removeBefore = (date: string) =>
    call<number>(() => LogService.logControllerRemoveBefore(date));

  return {
    findByDate,
    create,
    findOne,
    findAll,
    removeBefore,
    result: data,
    loading,
    error,
  };
}
