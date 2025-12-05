import { USER_MSG } from '@app/common/constants/messageEvent';
import { USER_SERVICES } from '@app/common/constants/services';
import { LogDatabaseConnection } from '@app/common/database/log-database-connection/log-database-connection';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { INotifService } from '@app/contracts/interfaces/app/INotifService';
import { NotificationReq } from '@app/contracts/shared-dto/notification/req/notificiationReq';
import { DeleteNotificationRes } from '@app/contracts/shared-dto/notification/res/deleteNotification';
import { NotificationRes } from '@app/contracts/shared-dto/notification/res/notificationRes';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationService implements INotifService {
  constructor(
    private readonly prisma: LogDatabaseConnection,
    @Inject(USER_SERVICES.CLIENT) private readonly userClient: ClientProxy,
  ) {}
  async create(dto: NotificationReq): Promise<NotificationRes> {
    try {
      const id: number = dto.userId;
      const settings: UserDto = await firstValueFrom(
        this.userClient.send(USER_MSG.findOne, id),
      );

      if (
        (settings.liked_notification_disabled && dto.type === 'LIKE') ||
        (settings.comments_notification_disabled && dto.type === 'COMMENT') ||
        (settings.followers_notification_disabled && dto.type === 'FOLLOW')
      ) {
        return {
          id: 0,
          userId: dto.userId,
          isSeen: dto.isSeen,
          title: dto.title,
          description: dto.description,
          createdAt: new Date(),
        };
      }

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
