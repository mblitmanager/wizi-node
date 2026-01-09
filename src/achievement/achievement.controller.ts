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
  async getAchievements(@Request() req: any) {
    const achievements = await this.achievementService.getAchievements(
      req.user.stagiaire?.id
    );
    return { achievements };
  }

  @Get("all")
  async getAllAchievements() {
    const achievements = await this.achievementService.getAllAchievements();
    return { achievements };
  }

  @Post("check")
  async checkAchievements(
    @Request() req: any,
    @Body("code") code?: string,
    @Body("quiz_id") quizId?: number
  ) {
    let newAchievements = [];
    if (code) {
      newAchievements = await this.achievementService.unlockAchievementByCode(
        req.user.stagiaire?.id,
        code
      );
    } else {
      newAchievements = await this.achievementService.checkAchievements(
        req.user.stagiaire?.id,
        quizId
      );
    }
    return { new_achievements: newAchievements };
  }
}
