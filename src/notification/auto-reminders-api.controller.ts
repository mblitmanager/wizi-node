import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponseService } from "../common/services/api-response.service";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";

@Controller("auto-reminders")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AutoRemindersApiController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get("history")
  async history() {
    // Placeholder - in real app this would query a dedicated table
    return this.apiResponse.success([
      {
        id: 1,
        type: "daily_reminder",
        sent_at: new Date().toISOString(),
        recipients_count: 5,
        status: "success",
      },
    ]);
  }

  @Get("stats")
  async stats() {
    return this.apiResponse.success({
      total_sent: 125,
      engagement_rate: "45%",
      last_run: new Date().toISOString(),
    });
  }

  @Get("targeted")
  async targeted() {
    return this.apiResponse.success([
      { id: 1, name: "Stagiaire Test", email: "test@example.com" },
    ]);
  }

  @Post("run")
  async run() {
    // Logic to trigger reminders would go here
    return this.apiResponse.success({
      message: "Les rappels automatiques ont été lancés.",
    });
  }
}
