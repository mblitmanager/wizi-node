import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { StagiaireService } from "./stagiaire.service";

@Controller("stagiaire")
export class StagiaireController {
  constructor(private stagiaireService: StagiaireService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  async getProfile(@Request() req) {
    return this.stagiaireService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("dashboard/home")
  async getHomeData(@Request() req) {
    return this.stagiaireService.getHomeData(req.user.id);
  }
}
