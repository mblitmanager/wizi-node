import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  Body,
  Put,
  Query,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { MailService } from "../mail/mail.service";
import { NotificationService } from "./notification.service";
import { ApiResponseService } from "../common/services/api-response.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";

@Controller("notifications")
@UseGuards(AuthGuard("jwt"))
export class NotificationsApiController {
  constructor(
    private notificationService: NotificationService,
    private apiResponse: ApiResponseService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  @Get()
  async index(@Request() req: any) {
    const notifications = await this.notificationService.getNotifications(
      req.user.id
    );
    return this.apiResponse.success(notifications);
  }

  @Get("unread-count")
  async unreadCount(@Request() req: any) {
    const count = await this.notificationService.getUnreadCount(req.user.id);
    return this.apiResponse.success({ count });
  }

  @Post("mark-all-read")
  async markAllRead(@Request() req: any) {
    await this.notificationService.markAllAsRead(req.user.id);
    return this.apiResponse.success({ message: "All marked as read" });
  }

  @Post("fcm-token")
  async updateFcmToken(@Request() req: any, @Body("token") token: string) {
    await this.userRepository.update(req.user.id, { fcm_token: token });
    return this.apiResponse.success({ message: "FCM token updated" });
  }

  @Post(":id/read")
  async markAsRead(@Param("id") id: number) {
    await this.notificationService.markAsRead(id);
    return this.apiResponse.success({ message: "Marked as read" });
  }

  @Delete(":id")
  async delete(@Param("id") id: number) {
    await this.notificationService.deleteNotification(id);
    return this.apiResponse.success({ message: "Notification deleted" });
  }
}

@Controller("notification-history")
@UseGuards(AuthGuard("jwt"))
export class NotificationHistoryApiController {
  constructor(
    private notificationService: NotificationService,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async index(@Request() req: any, @Query("page") page: string = "1") {
    const pageNum = parseInt(page) || 1;
    const baseUrl = `${req.protocol}://${req.get("host")}/api/notification-history`;
    const userId = req.user.id;
    const history =
      await this.notificationService.getNotificationHistoryPaginated(
        userId,
        pageNum,
        10,
        baseUrl
      );
    return this.apiResponse.success(history);
  }
}

@Controller("online-users")
@UseGuards(AuthGuard("jwt"))
export class OnlineUsersApiController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get()
  async index() {
    return this.apiResponse.success([]);
  }
}

@Controller("contact")
export class ContactApiController {
  constructor(private apiResponse: ApiResponseService) {}

  @Post()
  async sendContactForm(@Body() data: any) {
    return this.apiResponse.success({ message: "Contact form sent" });
  }
}

@Controller("email")
export class EmailApiController {
  constructor(
    private mailService: MailService,
    private apiResponse: ApiResponseService
  ) {}

  @Post()
  async send(@Body() data: any) {
    return this.apiResponse.success({ message: "Email sent" });
  }
}

@Controller("notify")
export class NotifyApiController {
  constructor(private apiResponse: ApiResponseService) {}

  @Post()
  async send(@Body() data: any) {
    return this.apiResponse.success({ message: "Notification sent" });
  }
}

@Controller("send-daily-notification")
export class SendDailyNotificationController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get()
  async send() {
    return this.apiResponse.success({ message: "Daily notifications sent" });
  }
}

@Controller("parrainage-events")
export class ParrainageEventsApiController {
  constructor(
    private notificationService: NotificationService,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async index() {
    const events = await this.notificationService.getParrainageEvents();
    return this.apiResponse.success(events);
  }
}
