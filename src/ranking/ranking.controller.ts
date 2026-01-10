import { Controller, Get, UseGuards, Request, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RankingService } from "./ranking.service";

@Controller(["classement", "quiz/classement"])
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get("global")
  async getGlobalRanking() {
    return this.rankingService.getGlobalRanking();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  async getMyRanking(@Request() req) {
    return this.rankingService.getMyRanking(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("points")
  async getMyPoints(@Request() req) {
    const points = await this.rankingService.getUserPoints(req.user.id);
    return points;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("formation/:formationId")
  async getFormationRanking(@Param("formationId") formationId: number) {
    return this.rankingService.getFormationRanking(formationId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("rewards")
  async getMyRewards(@Request() req) {
    // Note: This logic might need refinement depending on whether req.user.id is stagiaire_id
    // Usually it's userId.
    return this.rankingService.getStagiaireRewards(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("progress")
  async getMyProgress(@Request() req) {
    return this.rankingService.getStagiaireProgress(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("details/:stagiaireId")
  async getStagiaireDetails(@Param("stagiaireId") stagiaireId: number) {
    return this.rankingService.getStagiaireDetails(stagiaireId);
  }
}
