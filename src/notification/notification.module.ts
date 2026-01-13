import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { CommonModule } from "../common/common.module";
import { ApiResponseService } from "../common/services/api-response.service";
import { NotificationService } from "./notification.service";
import { Notification } from "../entities/notification.entity";
import { FcmService } from "./fcm.service";
import { ConfigModule } from "@nestjs/config";
import { ParrainageEvent } from "../entities/parrainage-event.entity";
import {
  NotificationsApiController,
  NotificationHistoryApiController,
  ParrainageApiController,
  OnlineUsersApiController,
  ContactApiController,
  EmailApiController,
  NotifyApiController,
  SendDailyNotificationController,
  ParrainageEventsApiController,
} from "./notification-apis.controller";
import { AutoRemindersApiController } from "./auto-reminders-api.controller";
import { BroadcastingApiController } from "./broadcasting-api.controller";

@Module({
  imports: [
    ConfigModule,
    CommonModule,
    TypeOrmModule.forFeature([Notification, User, ParrainageEvent]),
  ],
  providers: [NotificationService, FcmService],
  controllers: [
    NotificationsApiController,
    NotificationHistoryApiController,
    ParrainageApiController,
    AutoRemindersApiController,
    OnlineUsersApiController,
    ContactApiController,
    EmailApiController,
    NotifyApiController,
    SendDailyNotificationController,
    ParrainageEventsApiController,
    BroadcastingApiController,
  ],
  exports: [NotificationService, FcmService],
})
export class NotificationModule {}
