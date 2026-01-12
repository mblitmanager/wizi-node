import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Body,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ParrainageService } from "./parrainage.service";
import { FormationService } from "../formation/formation.service";

@Controller()
export class ParrainageController {
  constructor(
    private parrainageService: ParrainageService,
    private formationService: FormationService
  ) {}

  @Get("formationParrainage")
  async getFormationParrainage() {
    return this.formationService.getFormationParrainage();
  }

  @Get("parrainage-events")
  async getEvents() {
    return this.parrainageService.getEvents();
  }

  @Get("parrainage/get-data/:token")
  async getParrainData(@Param("token") token: string) {
    return this.parrainageService.getParrainData(token);
  }

  @Post("parrainage/register-filleul")
  async registerFilleul(@Body() data: any) {
    return this.parrainageService.registerFilleul(data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("parrainage/generate-link")
  async generateLink(@Request() req) {
    return this.parrainageService.generateLink(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stagiaire/parrainage/stats")
  async getStatsParrain(@Request() req) {
    return this.parrainageService.getStatsParrain(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("parrainage/stats/:parrainId")
  async getStatsParrainById(@Param("parrainId") parrainId: number) {
    return this.parrainageService.getStatsParrain(parrainId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stagiaire/parrainage/filleuls")
  async getFilleuls(@Request() req) {
    return this.parrainageService.getFilleuls(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stagiaire/parrainage/rewards")
  async getRewards(@Request() req) {
    return this.parrainageService.getRewards(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stagiaire/parrainage/history")
  async getHistory(@Request() req) {
    return this.parrainageService.getHistory(req.user.id);
  }
}
