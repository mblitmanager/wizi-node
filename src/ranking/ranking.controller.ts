import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RankingService } from "./ranking.service";

@Controller("classement")
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
    const ranking = await this.rankingService.getMyRanking(req.user.id);
    return { points: ranking?.totalPoints || 0 };
  }
}
