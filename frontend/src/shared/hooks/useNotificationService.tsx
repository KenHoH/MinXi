import { NotificationService } from "../../service/api/services/NotificationService";
import type { NotificationReq } from "../../service/api/models/NotificationReq";
import type { NotificationRes } from "../../service/api/models/NotificationRes";
import type { DeleteNotificationRes } from "../../service/api/models/DeleteNotificationRes";
import useApiCall from "./useApiCall";

export default function useNotificationService() {
  const { call, data, loading, error } = useApiCall();

  const create = (dto: NotificationReq) =>
    call<NotificationRes>(() =>
      NotificationService.notificationControllerCreate(dto)
    );

  const getNotif = (userId: number) =>
    call<NotificationRes[]>(() =>
      NotificationService.notificationControllerGetNotif(userId)
    );

  const remove = (notificationId: number) =>
    call<DeleteNotificationRes>(() =>
      NotificationService.notificationControllerRemove(notificationId)
    );

  return {
    create,
    getNotif,
    remove,
    result: data,
    loading,
    error,
  };
}
