import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useEffect } from "react";
import { useSSE } from "../hooks/useSSE";
import useSseService from "../hooks/useSseService";
import useNotificationService from "../hooks/useNotificationService";
export type NotifType = "LIKE" | "COMMENT" | "FOLLOW" | "SYSTEM";
export default function useNotification() {
  const { user } = useAuthContext();
  const { notifications } = useSSE(user?.user_id ? String(user.user_id) : "");
  const { showToast } = useToast();
  const { sendNotification } = useSseService();
  const { create } = useNotificationService();

  const sendNotificatonSystem = async (
    userId: number,
    description: string,
    title: string,
    type: NotifType
  ) => {
    await Promise.all([
      sendNotification({
        userId,
        description,
        title,
        isSeen: false,
        type,
      }),
      create({
        isSeen: false,
        userId: userId,
        title,
        description,
        type,
      }),
    ]);
  };

  useEffect(() => {
    if (notifications.length === 0) return;

    const latestNotification = notifications[notifications.length - 1];
    showToast(latestNotification.title, latestNotification.description, "info");

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(latestNotification.title, {
          body: latestNotification.description,
        });
      }
    });
  }, [notifications]);

  return { sendNotificatonSystem };
}
