import { NotificationReq } from '@app/contracts/shared-dto/notification/req/notificiationReq';
import { NotificationRes } from '@app/contracts/shared-dto/notification/res/notificationRes';
import { BroadcastNotifReq } from '@app/contracts/shared-dto/sse/req/BroadcastNotifReq';

export function buildNotifResponse(dto: BroadcastNotifReq): NotificationReq {
  return {
    userId: dto.userId,
    title: dto.title,
    description: dto.description,
    isSeen: dto.isSeen,
    type: dto.type,
  };
}
