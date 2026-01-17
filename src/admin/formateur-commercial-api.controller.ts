import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponseService } from "../common/services/api-response.service";
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
    const stats = await this.adminService.getFormateurDashboardStats(
      req.user.id
    );
    return this.apiResponse.success(stats);
  }

  @Get("formations")
  async formations(@Request() req: any) {
    return this.apiResponse.success([]);
  }

  @Get("stagiaires")
  async stagiaires(@Request() req: any) {
    console.log("[DEBUG] Controller: GET /api/formateur/stagiaires hit");
    const data = await this.adminService.getFormateurStagiaires();
    console.log(
      `[DEBUG] Controller: Service returned ${data.length} stagiaires`
    );
    return this.apiResponse.success({ stagiaires: data });
  }

  @Get("stagiaires/online")
  async onlineStagiaires() {
    const data = await this.adminService.getOnlineStagiaires();
    return this.apiResponse.success({
      stagiaires: data,
      total: data.length,
    });
  }

  @Get("stagiaires/inactive")
  async inactiveStagiaires(
    @Request() req,
    @Query("days") days: number = 7,
    @Query("scope") scope: string = "all"
  ) {
    const stats = await this.adminService.getFormateurInactiveStagiaires(
      req.user.id,
      days,
      scope
    );
    return this.apiResponse.success(stats);
  }

  @Get("stagiaires/never-connected")
  async neverConnected() {
    const data = await this.adminService.getNeverConnected();
    return this.apiResponse.success({ stagiaires: data });
  }

  @Get("stagiaires/performance")
  async performance(@Request() req) {
    const stats = await this.adminService.getFormateurStagiairesPerformance(
      req.user.id
    );
    return this.apiResponse.success(stats);
  }

  @Post("stagiaires/disconnect")
  @HttpCode(200)
  async disconnect(@Body() data: { stagiaire_ids: number[] }) {
    const updatedCount = await this.adminService.disconnectStagiaires(
      data.stagiaire_ids
    );
    return this.apiResponse.success({
      success: true,
      message: `${updatedCount} stagiaire(s) déconnecté(s)`,
      disconnected_count: updatedCount,
    });
  }

  @Get("stagiaire/:id/stats")
  async stagiaireStats(@Param("id") id: number) {
    const stats = await this.adminService.getStagiaireStats(id);
    if (!stats) {
      return this.apiResponse.error("Stagiaire non trouvé", 404);
    }
    return this.apiResponse.success(stats);
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
  async mesStagiairesRanking(
    @Request() req,
    @Query("period") period: string = "all"
  ) {
    const data = await this.adminService.getFormateurMesStagiairesRanking(
      req.user.id,
      period
    );
    return this.apiResponse.success(data);
  }

  @Post("send-email")
  async sendEmail(@Body() data: any) {
    return this.apiResponse.success();
  }

  @Post("send-notification")
  async sendNotification(@Body() data: any) {
    return this.apiResponse.success();
  }

  @Get("trends")
  async trends(@Request() req: any) {
    const data = await this.adminService.getFormateurTrends(req.user.id);
    return this.apiResponse.success(data);
  }

  @Get("stats/dashboard")
  async stats() {
    return this.apiResponse.success({});
  }
}

@Controller("commercial/stats")
@UseGuards(AuthGuard("jwt"))
export class CommercialApiController {
  constructor(
    private apiResponse: ApiResponseService,
    private adminService: AdminService
  ) {}

  @Get("dashboard")
  async dashboard(@Request() req: any) {
    const data = await this.adminService.getCommercialDashboardStats();
    return this.apiResponse.success(data);
  }
}
