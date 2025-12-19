import { USER_MSG } from '@app/common/constants/messageEvent';
import { USER_SERVICES } from '@app/common/constants/services';
import { LogDatabaseConnection } from '@app/common/database/log-database-connection/log-database-connection';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { INotifService } from '@app/contracts/interfaces/app/INotifService';
import { NotificationReq } from '@app/contracts/shared-dto/notification/req/notificiationReq';
import { DeleteNotificationRes } from '@app/contracts/shared-dto/notification/res/deleteNotification';
import { NotificationRes } from '@app/contracts/shared-dto/notification/res/notificationRes';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationService implements INotifService {
  constructor(
    private readonly prisma: LogDatabaseConnection,
    @Inject(USER_SERVICES.CLIENT) private readonly userClient: ClientProxy,
  ) {}
  log = new Logger('NotificationService');
  async create(dto: NotificationReq): Promise<NotificationRes> {
    try {
      const id: number = dto.userId;
      const settings: UserDto = await firstValueFrom(
        this.userClient.send(USER_MSG.findOne, id),
      );
      const sender: UserDto = await firstValueFrom(
        this.userClient.send(USER_MSG.findOne, dto.sendId),
      );
      dto.title = `${sender.username} ${dto.title}`;
      dto.description = `${dto.description}`;
      this.log.debug(`User sender = ${sender.username}`);
      if (
        (settings.liked_notification_disabled && dto.type === 'LIKE') ||
        (settings.comments_notification_disabled && dto.type === 'COMMENT') ||
        (settings.followers_notification_disabled && dto.type === 'FOLLOW')
      ) {
        return {
          id: 0,
          userId: dto.userId,
          username: sender.username,
          profilePicture: sender.profile_picture,
          isSeen: dto.isSeen,
          title: dto.title,
          description: dto.description,
          createdAt: new Date(),
        };
      }

      const notification = await this.prisma.notification.create({
        data: {
          userId: dto.userId,
          sendId: dto.sendId,
          isSeen: dto.isSeen,
          title: dto.title,
          description: dto.description,
        },
      });
      return {
        id: 0,
        userId: notification.userId,
        username: sender.username,
        profilePicture: sender.profile_picture,
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
        this.log.debug(
          `Fetched user instance for area ID: ${userInstance.area_id}`,
        );
        const allInstance = await firstValueFrom(
          this.userClient.send(USER_MSG.findAll, userInstance.area_id),
        );

        const notificationsWithUser: NotificationRes[] = notifications.map(
          (notification) => {
            this.log.debug(`Mapping notification ID: ${notification.sendId}`);
            const sender = allInstance.find(
              (user: UserDto) => user.user_id === notification.sendId,
            );
            this.log.debug(
              `Found sender: ${sender?.username} for notification ID: ${notification.sendId}`,
            );
            return {
              id: notification.id,
              userId: notification.userId,
              username: sender?.username || 'Unknown',
              profilePicture:
                sender?.profile_picture ||
                '/api/uploads/profile/1763906830326-69740177.png',
              isSeen: notification.isSeen,
              title: notification.title,
              description: notification.description,
              createdAt: notification.createdAt,
            };
          },
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
  async deleteNotification(userId: number): Promise<number> {
    try {
      const notification = await this.prisma.notification.deleteMany({
        where: {
          userId: userId,
        },
      });
      return notification.count;
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
