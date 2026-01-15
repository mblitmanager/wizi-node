import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { NotificationService } from "./notification.service";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("notifications")
@UseGuards(AuthGuard("jwt"))
export class FcmTestController {
  constructor(
    private notificationService: NotificationService,
    private apiResponse: ApiResponseService
  ) {}

  @Get("test-push")
  async testPush(@Request() req: any) {
    const userId = req.user.id;
    const result = await this.notificationService.createNotification(
      userId,
      "test",
      "Ceci est une notification de test depuis Node.js !",
      {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        message: "Test message",
      },
      "Test Push Node"
    );

    return this.apiResponse.success({
      message: "Notification de test envoyée",
      result,
    });
  }
}
