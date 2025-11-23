import { useState, useCallback } from "react";
import {
  NotificationService,
  type NotificationReq,
  type NotificationRes,
  type DeleteNotificationRes,
} from "@/services/api";
import { useToast } from "../context/ToastContext";
import { useLoading } from "../context/LoadingContext";

interface UseNotificationServiceReturn {
  // State - typed DTOs
  notificationData: NotificationRes | null;
  notificationsData: NotificationRes[] | null;
  deleteNotificationData: DeleteNotificationRes | null;
  error: string | null;
  isLoading: boolean;

  // Methods
  createNotification: (dto: NotificationReq) => Promise<void>;
  getNotifications: (userId: number) => Promise<void>;
  removeNotification: (notificationId: number) => Promise<void>;
  resetError: () => void;
}

export default function useNotificationService(): UseNotificationServiceReturn {
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const [notificationData, setNotificationData] =
    useState<NotificationRes | null>(null);
  const [notificationsData, setNotificationsData] = useState<
    NotificationRes[] | null
  >(null);
  const [deleteNotificationData, setDeleteNotificationData] =
    useState<DeleteNotificationRes | null>(null);
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

  const createNotification = useCallback(
    async (dto: NotificationReq) => {
      setIsLoading(true);
      resetError();
      try {
        const result = await NotificationService.notificationControllerCreate(
          dto
        );
        setNotificationData(result);
      } catch (err) {
        handleError(err, "Failed to create notification. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError]
  );

  const getNotifications = useCallback(
    async (userId: number) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await NotificationService.notificationControllerGetNotif(
          userId
        );
        setNotificationsData(result);
      } catch (err) {
        handleError(err, "Failed to fetch notifications. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const removeNotification = useCallback(
    async (notificationId: number) => {
      setIsLoading(true);
      resetError();
      try {
        const result = await NotificationService.notificationControllerRemove(
          notificationId
        );
        setDeleteNotificationData(result);
        showToast("Notification removed");
      } catch (err) {
        handleError(err, "Failed to remove notification. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  return {
    notificationData,
    notificationsData,
    deleteNotificationData,
    error,
    isLoading,
    createNotification,
    getNotifications,
    removeNotification,
    resetError,
  };
}
