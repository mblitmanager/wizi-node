import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InscriptionService } from "../inscription/inscription.service";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("api/stagiaire")
@UseGuards(AuthGuard("jwt"))
export class StagiaireApiController {
  constructor(
    private inscriptionService: InscriptionService,
    private apiResponse: ApiResponseService
  ) {}

  @Get("profile")
  async profile(@Request() req: any) {
    return this.apiResponse.success(req.user);
  }

  @Put("profile")
  async updateProfile(@Request() req: any, @Body() data: any) {
    return this.apiResponse.success(req.user);
  }

  @Patch("profile")
  async patchProfile(@Request() req: any, @Body() data: any) {
    return this.apiResponse.success(req.user);
  }

  @Post("profile/photo")
  async uploadProfilePhoto(@Request() req: any, @Body() data: any) {
    return this.apiResponse.success();
  }

  @Get("show")
  async show(@Request() req: any) {
    return this.apiResponse.success(req.user);
  }

  @Get("dashboard/home")
  async dashboardHome(@Request() req: any) {
    return this.apiResponse.success(req.user);
  }

  @Get("formations")
  async formations(@Request() req: any) {
    return this.apiResponse.success([]);
  }

  @Get("formations/:formationId/classement")
  async formationClassement() {
    return this.apiResponse.success([]);
  }

  @Post("inscription-catalogue-formation")
  async inscriptionCatalogueFormation(@Request() req: any, @Body() data: any) {
    return this.inscriptionService.inscrire(
      req.user.id,
      data.catalogue_formation_id
    );
  }

  @Post("onboarding-seen")
  async onboardingSeen(@Request() req: any) {
    return this.apiResponse.success();
  }

  @Get("achievements")
  async achievements(@Request() req: any) {
    return this.apiResponse.success([]);
  }

  @Get("achievements/all")
  async allAchievements() {
    return this.apiResponse.success([]);
  }

  @Post("achievements/check")
  async checkAchievements() {
    return this.apiResponse.success();
  }

  @Get("contacts")
  async contacts() {
    return this.apiResponse.success([]);
  }

  @Get("contacts/commerciaux")
  async contactsCommerciaux() {
    return this.apiResponse.success([]);
  }

  @Get("contacts/formateurs")
  async contactsFormateurs() {
    return this.apiResponse.success([]);
  }

  @Get("contacts/pole-relation")
  async contactsPoleRelation() {
    return this.apiResponse.success([]);
  }

  @Get("contacts/pole-save")
  async contactsPoleSave() {
    return this.apiResponse.success([]);
  }

  @Get("progress")
  async progress(@Request() req: any) {
    const user = req.user;
    return this.apiResponse.success({
      stagiaire: {
        id: user.stagiaire?.id?.toString() || "0",
        prenom: user.stagiaire?.prenom || user.name,
        image: user.image || null,
      },
      totalPoints: 0,
      quizCount: 0,
      averageScore: 0,
      completedQuizzes: 0,
      totalTimeSpent: 0,
      rang: 0,
      level: 0,
    });
  }

  @Get("quizzes")
  async quizzes() {
    return this.apiResponse.success([]);
  }

  @Get("ranking/global")
  async rankingGlobal() {
    return this.apiResponse.success([]);
  }

  @Get("ranking/formation/:formationId")
  async rankingFormation() {
    return this.apiResponse.success([]);
  }

  @Get("rewards")
  async rewards() {
    return this.apiResponse.success([]);
  }

  @Get("partner")
  async partner() {
    return this.apiResponse.success({});
  }

  @Get("parrainage/stats")
  async parainageStats() {
    return this.apiResponse.success({});
  }

  @Get("parrainage/history")
  async parainageHistory() {
    return this.apiResponse.success([]);
  }

  @Get("parrainage/filleuls")
  async parainageFilleuls() {
    return this.apiResponse.success([]);
  }

  @Get("parrainage/rewards")
  async parainageRewards() {
    return this.apiResponse.success([]);
  }

  @Post("parrainage/accept")
  async parainageAccept(@Body() data: any) {
    return this.apiResponse.success();
  }

  @Get(":id/formations")
  async userFormations(@Param("id") id: number) {
    return this.apiResponse.success([]);
  }

  @Get(":id/catalogueFormations")
  async userCatalogueFormations(@Param("id") id: number) {
    return this.apiResponse.success([]);
  }
}

@Controller("api")
@UseGuards(AuthGuard("jwt"))
export class ApiGeneralController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get("user")
  async getUser(@Request() req: any) {
    return this.apiResponse.success(req.user);
  }

  @Get("me")
  async getMe(@Request() req: any) {
    return this.apiResponse.success(req.user);
  }

  @Get("user/settings")
  async getUserSettings(@Request() req: any) {
    return this.apiResponse.success({});
  }

  @Put("user/settings")
  async updateUserSettings(@Request() req: any, @Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Post("user-app-usage")
  async reportUserAppUsage(@Request() req: any, @Body() data: any) {
    return this.apiResponse.success();
  }

  @Post("user/photo")
  async updateUserPhoto(@Request() req: any, @Body() data: any) {
    return this.apiResponse.success();
  }

  @Get("users/me/points")
  async getUserPoints(@Request() req: any) {
    return this.apiResponse.success({ points: 0 });
  }

  @Post("fcm-token")
  async updateFcmToken(@Request() req: any, @Body("token") token: string) {
    return this.apiResponse.success();
  }
}
