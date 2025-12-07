import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationReq } from '@app/contracts/shared-dto/notification/req/notificiationReq';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '@app/common/decorators/public.decorator';
import { NotificationRes } from '@app/contracts/shared-dto/notification/res/notificationRes';
import { DeleteNotificationRes } from '@app/contracts/shared-dto/notification/res/deleteNotification';

@Controller('notification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() dto: NotificationReq): Promise<NotificationRes> {
    return this.notificationService.create(dto);
  }

  @Public()
  @Get(':userId')
  getNotif(@Param('userId') userId: number): Promise<NotificationRes[]> {
    return this.notificationService.getNotification(userId);
  }

  @Delete(':notificationId')
  remove(@Param('notificationId') notificationId: number): Promise<number> {
    return this.notificationService.deleteNotification(notificationId);
  }
}
