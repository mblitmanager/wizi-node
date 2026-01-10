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
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { MailService } from "../mail/mail.service";

@Controller("api/notifications")
@UseGuards(AuthGuard("jwt"))
export class NotificationsApiController {
  constructor() {}

  @Get()
  async index(@Request() req: any) {
    return { data: [], message: "Notifications" };
  }

  @Get("unread-count")
  async unreadCount() {
    return { count: 0 };
  }

  @Post("mark-all-read")
  async markAllRead() {
    return { message: "All marked as read" };
  }

  @Post(":id/read")
  async markAsRead(@Param("id") id: number) {
    return { message: "Marked as read" };
  }

  @Delete(":id")
  async delete(@Param("id") id: number) {
    return { message: "Notification deleted" };
  }
}

@Controller("api/notification-history")
@UseGuards(AuthGuard("jwt"))
export class NotificationHistoryApiController {
  constructor() {}

  @Get()
  async index() {
    return { data: [], message: "Notification history" };
  }
}

@Controller("api/parrainage")
@UseGuards(AuthGuard("jwt"))
export class ParrainageApiController {
  constructor() {}

  @Post("generate-link")
  async generateLink() {
    return { link: "http://example.com/parrainage/token" };
  }

  @Get("get-data/:token")
  async getData(@Param("token") token: string) {
    return { data: {}, message: "Parrainage data" };
  }

  @Post("register-filleul")
  async registerFilleul(@Body() data: any) {
    return { message: "Filleul registered" };
  }

  @Get("stats/:parrain_id")
  async stats() {
    return { data: {}, message: "Parrainage stats" };
  }
}

@Controller("api/announcements")
@UseGuards(AuthGuard("jwt"))
export class AnnouncementsApiController {
  constructor() {}

  @Get()
  async index() {
    return { data: [], message: "Announcements" };
  }

  @Post()
  async store(@Body() data: any) {
    return { message: "Announcement created", data };
  }

  @Get("recipients")
  async getRecipients() {
    return { data: [], message: "Recipients list" };
  }

  @Get(":announcement")
  async show(@Param("announcement") id: number) {
    return { data: {}, message: "Announcement details" };
  }

  @Put(":announcement")
  async update(@Param("announcement") id: number, @Body() data: any) {
    return { message: "Announcement updated", data };
  }

  @Delete(":announcement")
  async destroy(@Param("announcement") id: number) {
    return { message: "Announcement deleted" };
  }
}

@Controller("api/auto-reminders")
@UseGuards(AuthGuard("jwt"))
export class AutoRemindersApiController {
  constructor() {}

  @Get("history")
  async history() {
    return { data: [], message: "Reminder history" };
  }

  @Get("stats")
  async stats() {
    return { data: {}, message: "Reminder stats" };
  }

  @Get("targeted")
  async targeted() {
    return { data: [], message: "Targeted users" };
  }

  @Post("run")
  async run() {
    return { message: "Reminders sent" };
  }
}

@Controller("api/online-users")
@UseGuards(AuthGuard("jwt"))
export class OnlineUsersApiController {
  constructor() {}

  @Get()
  async index() {
    return { data: [], message: "Online users" };
  }
}

@Controller("api/contact")
export class ContactApiController {
  constructor() {}

  @Post()
  async sendContactForm(@Body() data: any) {
    return { message: "Contact form sent" };
  }
}

@Controller("api/email")
export class EmailApiController {
  constructor(private mailService: MailService) {}

  @Post("test")
  async send(@Body() data: any) {
    await this.mailService.sendMail(
      data.to || "test@wizi-learn.com",
      data.subject || "Test Email",
      "confirmation",
      { name: "Test User" }
    );
    return { message: "Email sent successfully with template" };
  }
}

@Controller("api/notify")
export class NotifyApiController {
  constructor() {}

  @Post()
  async send(@Body() data: any) {
    return { message: "Notification sent" };
  }
}

@Controller("api/send-daily-notification")
export class SendDailyNotificationController {
  constructor() {}

  @Get()
  async send() {
    return { message: "Daily notifications sent" };
  }
}

@Controller("api/parrainage-events")
export class ParrainageEventsApiController {
  constructor() {}

  @Get()
  async index() {
    return { data: [], message: "Parrainage events" };
  }
}
