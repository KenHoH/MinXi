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
          username: settings.username,
          profilePicture: settings.profile_picture,
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
      return {
        id: 0,
        userId: notification.userId,
        username: settings.username,
        profilePicture: settings.profile_picture,
        isSeen: notification.isSeen,
        title: notification.title,
        description: notification.description,
        createdAt: notification.createdAt,
      };
    } catch (error) {
      throw httpToRpc(
        new HttpException('Failed to Send Notification', HttpStatus.NOT_FOUND),
      );
    }
  }
  async getNotification(userId: number): Promise<NotificationRes[]> {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const notifications = await prisma.notification.findMany({
          where: {
            userId: userId,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
        const userInstance: UserDto = await firstValueFrom(
          this.userClient.send(USER_MSG.findOne, userId),
        );
        const notificationsWithUser: NotificationRes[] = notifications.map(
          (notification) => ({
            id: notification.id,
            userId: notification.userId,
            username: userInstance.username,
            profilePicture: userInstance.profile_picture,
            isSeen: notification.isSeen,
            title: notification.title,
            description: notification.description,
            createdAt: notification.createdAt,
          }),
        );
        return notificationsWithUser;
      });
      return result;
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
