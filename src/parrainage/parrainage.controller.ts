import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ParrainageService } from "./parrainage.service";

@Controller("parrainage")
export class ParrainageController {
  constructor(private readonly parrainageService: ParrainageService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("generate-link")
  async generateLink(@Request() req) {
    return this.parrainageService.generateLink(req.user.id);
  }

  @Get("get-data/:token")
  async getParrainData(@Param("token") token: string) {
    return this.parrainageService.getParrainData(token);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stats")
  async getStatsParrain(@Request() req) {
    return this.parrainageService.getStatsParrain(req.user.id);
  }
}
