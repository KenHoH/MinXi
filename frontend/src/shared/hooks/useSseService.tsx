import { SseService } from "../../service/api/services/SseService";
import type { Ack } from "../../service/api/models/Ack";
import type { BroadcastNotifReq } from "../../service/api/models/BroadcastNotifReq";
import type { ConnectionStatsRes } from "../../service/api/models/ConnectionStatsRes";
import useApiCall from "./useApiCall";

interface SendBroadcastFormData {
  metadata?: Blob;
  room_id: string;
  author_id: number;
  message: string;
  author_name?: string;
  author_profile_url?: string;
}

export default function useSseService() {
  const { call, data, loading, error } = useApiCall();

  const subscribeToRoom = (roomId: string) =>
    call<any>(() => SseService.sseControllerSubscribeToRoom(roomId));

  const sendBroadcast = (formData: SendBroadcastFormData) =>
    call<Ack>(() => SseService.sseControllerSendBroadcast(formData));

  const sendNotification = (dto: BroadcastNotifReq) =>
    call<Ack>(() => SseService.sseControllerSendNotification(dto));

  const getStats = () =>
    call<ConnectionStatsRes>(() => SseService.sseControllerGetStats());

  return {
    subscribeToRoom,
    sendBroadcast,
    sendNotification,
    getStats,
    result: data,
    loading,
    error,
  };
}
