import { NOTIF_MSG } from '@app/common/constants/messageEvent';
import { NOTIF_SERVICES } from '@app/common/constants/services';
import { INotifService } from '@app/contracts/interfaces/app/INotifService';
import { NotificationReq } from '@app/contracts/shared-dto/notification/req/notificiationReq';
import { DeleteNotificationRes } from '@app/contracts/shared-dto/notification/res/deleteNotification';
import { NotificationRes } from '@app/contracts/shared-dto/notification/res/notificationRes';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationService implements INotifService {
  constructor(
    @Inject(NOTIF_SERVICES.CLIENT) private readonly client: ClientProxy,
  ) {}
  async create(dto: NotificationReq): Promise<NotificationRes> {
    return await firstValueFrom(this.client.send(NOTIF_MSG.create, dto));
  }
  async getNotification(userId: number): Promise<NotificationRes[]> {
    return await firstValueFrom(this.client.send(NOTIF_MSG.getNotif, userId));
  }
  async deleteNotification(
    notificationId: number,
  ): Promise<DeleteNotificationRes> {
    return await firstValueFrom(
      this.client.send(NOTIF_MSG.deleteNotif, notificationId),
    );
  }
}
