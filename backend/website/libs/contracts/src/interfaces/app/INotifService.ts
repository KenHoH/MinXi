import { NotificationReq } from '@app/contracts/shared-dto/notification/req/notificiationReq';
import { DeleteNotificationRes } from '@app/contracts/shared-dto/notification/res/deleteNotification';
import { NotificationRes } from '@app/contracts/shared-dto/notification/res/notificationRes';

export interface INotifService {
  create(dto: NotificationReq): Promise<NotificationRes>;
  getNotification(userId: number): Promise<NotificationRes[]>;
  deleteNotification(notificationId: number): Promise<DeleteNotificationRes>;
}
