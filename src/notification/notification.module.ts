import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "../common/common.module";
import { ApiResponseService } from "../common/services/api-response.service";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { Notification } from "../entities/notification.entity";
import {
  NotificationsApiController,
  NotificationHistoryApiController,
  ParrainageApiController,
  AnnouncementsApiController,
  AutoRemindersApiController,
  OnlineUsersApiController,
  ContactApiController,
  EmailApiController,
  NotifyApiController,
  SendDailyNotificationController,
  ParrainageEventsApiController,
} from "./notification-apis.controller";

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([Notification])],
  providers: [NotificationService, ApiResponseService],
  controllers: [
    NotificationController,
    NotificationsApiController,
    NotificationHistoryApiController,
    ParrainageApiController,
    AnnouncementsApiController,
    AutoRemindersApiController,
    OnlineUsersApiController,
    ContactApiController,
    EmailApiController,
    NotifyApiController,
    SendDailyNotificationController,
    ParrainageEventsApiController,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
