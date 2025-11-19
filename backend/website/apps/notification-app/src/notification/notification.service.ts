import { LogDatabaseConnection } from '@app/common/database/log-database-connection/log-database-connection';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { INotifService } from '@app/contracts/interfaces/app/INotifService';
import { NotificationReq } from '@app/contracts/shared-dto/notification/req/notificiationReq';
import { DeleteNotificationRes } from '@app/contracts/shared-dto/notification/res/deleteNotification';
import { NotificationRes } from '@app/contracts/shared-dto/notification/res/notificationRes';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService implements INotifService {
  constructor(private readonly prisma: LogDatabaseConnection) {}
  async create(dto: NotificationReq): Promise<NotificationRes> {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: dto.userId,
          isSeen: dto.isSeen,
          title: dto.title,
          description: dto.description,
        },
      });
      return notification;
    } catch (error) {
      throw httpToRpc(
        new HttpException('Failed to Send Notification', HttpStatus.NOT_FOUND),
      );
    }
  }
  async getNotification(userId: number): Promise<NotificationRes[]> {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          userId: userId,
        },
      });
      return notifications;
    } catch (error) {
      throw httpToRpc(
        new HttpException('No Notifications', HttpStatus.NOT_FOUND),
      );
    }
  }
  async deleteNotification(
    notificationId: number,
  ): Promise<DeleteNotificationRes> {
    try {
      const notification = await this.prisma.notification.delete({
        where: {
          id: notificationId,
        },
      });
      return notification;
    } catch (error) {
      throw httpToRpc(
        new HttpException(
          'Failed to Delete Notification',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
  }
}
