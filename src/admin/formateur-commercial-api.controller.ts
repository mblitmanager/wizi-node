import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AdminService } from "./admin.service";

@Controller("formateur")
@UseGuards(AuthGuard("jwt"))
export class FormateurApiController {
  constructor(
    private apiResponse: ApiResponseService,
    private adminService: AdminService
  ) {}

  @Get("dashboard/stats")
  async dashboardStats(@Request() req: any) {
    return this.apiResponse.success({});
  }

  @Get("formations")
  async formations(@Request() req: any) {
    return this.apiResponse.success([]);
  }

  @Get("stagiaires")
  async stagiaires(@Request() req: any) {
    return this.apiResponse.success([]);
  }

  @Get("stagiaires/online")
  async onlineStagiaires() {
    return this.apiResponse.success([]);
  }

  @Get("stagiaires/inactive")
  async inactiveStagiaires() {
    return this.apiResponse.success([]);
  }

  @Get("stagiaires/never-connected")
  async neverConnected() {
    return this.apiResponse.success([]);
  }

  @Get("stagiaires/performance")
  async performance(@Request() req) {
    const stats = await this.adminService.getFormateurStagiairesPerformance(
      req.user.id
    );
    return this.apiResponse.success(stats);
  }

  @Post("stagiaires/disconnect")
  async disconnect(@Body() data: any) {
    return this.apiResponse.success();
  }

  @Get("stagiaire/:id/stats")
  async stagiaireStats(@Param("id") id: number) {
    return this.apiResponse.success({});
  }

  @Get("video/:id/stats")
  async videoStats(@Param("id") id: number) {
    return this.apiResponse.success({});
  }

  @Get("videos")
  async videos() {
    return this.apiResponse.success([]);
  }

  @Get("classement/formation/:formationId")
  async formationRanking(@Param("formationId") formationId: number) {
    return this.apiResponse.success([]);
  }

  @Get("classement/mes-stagiaires")
  async mesStagiairesRanking() {
    return this.apiResponse.success([]);
  }

  @Post("send-email")
  async sendEmail(@Body() data: any) {
    return this.apiResponse.success();
  }

  @Post("send-notification")
  async sendNotification(@Body() data: any) {
    return this.apiResponse.success();
  }

  @Get("stats/dashboard")
  async stats() {
    return this.apiResponse.success({});
  }
}

@Controller("commercial/stats")
@UseGuards(AuthGuard("jwt"))
export class CommercialApiController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get("dashboard")
  async dashboard(@Request() req: any) {
    return this.apiResponse.success({});
  }
}
