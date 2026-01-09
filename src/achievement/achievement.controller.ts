import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AchievementService } from "./achievement.service";

@Controller("stagiaire/achievements")
@UseGuards(AuthGuard("jwt"))
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get()
  async getAchievements(@Request() req) {
    return this.achievementService.getAchievements(req.user.stagiaire?.id);
  }

  @Get("all")
  async getAllAchievements() {
    return this.achievementService.getAllAchievements();
  }

  @Post("check")
  async checkAchievements(
    @Request() req,
    @Body("code") code?: string,
    @Body("quiz_id") quizId?: number
  ) {
    if (code) {
      return this.achievementService.unlockAchievementByCode(
        req.user.stagiaire?.id,
        code
      );
    }
    return this.achievementService.checkAchievements(
      req.user.stagiaire?.id,
      quizId
    );
  }
}
