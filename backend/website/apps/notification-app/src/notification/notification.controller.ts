import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { NOTIF_MSG } from '@app/common/constants/messageEvent';
import { NotificationReq } from '@app/contracts/shared-dto/notification/req/notificiationReq';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern(NOTIF_MSG.create)
  async create(@Payload() dto: NotificationReq) {
    return this.notificationService.create(dto);
  }

  @MessagePattern(NOTIF_MSG.getNotif)
  async getNotification(@Payload() userId: number) {
    return this.notificationService.getNotification(userId);
  }

  @MessagePattern(NOTIF_MSG.deleteNotif)
  async remove(@Payload() userId: number) {
    return this.notificationService.deleteNotification(userId);
  }
}
