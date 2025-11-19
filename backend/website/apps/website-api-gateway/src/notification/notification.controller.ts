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

@Controller('notification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() dto: NotificationReq) {
    return this.notificationService.create(dto);
  }

  @Get(':userId')
  getNotif(@Param('userId') userId: number) {
    return this.notificationService.getNotification(userId);
  }

  @Delete(':notificationId')
  remove(@Param('notificationId') notificationId: number) {
    return this.notificationService.deleteNotification(notificationId);
  }
}
