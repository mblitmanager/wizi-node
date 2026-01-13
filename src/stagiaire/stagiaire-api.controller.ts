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
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { InscriptionService } from "../inscription/inscription.service";
import { RankingService } from "../ranking/ranking.service";
import { StagiaireService } from "./stagiaire.service";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("stagiaire")
@UseGuards(AuthGuard("jwt"))
export class StagiaireApiController {
  constructor(
    private inscriptionService: InscriptionService,
    private rankingService: RankingService,
    private stagiaireService: StagiaireService,
    private apiResponse: ApiResponseService
  ) {}

  @Get("profile")
  async profile(@Request() req: any) {
    const data = await this.stagiaireService.getDetailedProfile(req.user.id);
    return this.apiResponse.success(data);
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
    const userId = req.user.id; // Fallback for testing
    const data = await this.stagiaireService.getShowData(userId);
    return this.apiResponse.success(data);
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
  async formationClassement(@Param("formationId") formationId: number) {
    const data = await this.rankingService.getFormationRanking(formationId);
    return this.apiResponse.success(data);
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
    const data = await this.rankingService.getStagiaireProgress(req.user.id);
    return this.apiResponse.success(data);
  }

  @Get("quizzes")
  async quizzes(@Request() req: any) {
    const userId = req.user?.id || 7;
    return {
      data: await this.rankingService.getQuizHistory(userId),
    };
  }

  @Get("ranking/global")
  async rankingGlobal() {
    const data = await this.rankingService.getGlobalRanking();
    return this.apiResponse.success(data);
  }

  @Get("ranking/formation/:formationId")
  async rankingFormation(@Param("formationId") formationId: number) {
    const data = await this.rankingService.getFormationRanking(formationId);
    return this.apiResponse.success(data);
  }

  @Get("rewards")
  async rewards(@Request() req: any) {
    const userId = req.user?.id || 7;
    const data = await this.rankingService.getStagiaireRewards(userId);
    return this.apiResponse.success(data);
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
    const response = await this.stagiaireService.getFormationsByStagiaire(id);
    return response.data;
  }
}

@Controller()
@UseGuards(AuthGuard("jwt"))
export class ApiGeneralController {
  constructor(
    private rankingService: RankingService,
    private stagiaireService: StagiaireService,
    private apiResponse: ApiResponseService
  ) {}

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
    const data = await this.rankingService.getUserPoints(req.user.id);
    return this.apiResponse.success(data);
  }

  @Post("avatar/:id/update-profile")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./public/uploads/users",
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    })
  )
  async updateAvatar(
    @Param("id") id: string,
    @UploadedFile() file: any,
    @Request() req: any
  ) {
    if (!file) {
      return this.apiResponse.error("No image uploaded", 400);
    }
    const photoPath = `uploads/users/${file.filename}`;
    await this.stagiaireService.updateProfilePhoto(req.user.id, photoPath);
    return this.apiResponse.success({
      message: "Avatar mis à jour",
      avatar: photoPath,
    });
  }

  @Get("user-status")
  async getUserStatus() {
    const data = await this.stagiaireService.getOnlineUsers();
    return data;
  }

  @Post("fcm-token")
  async updateFcmToken(@Request() req: any, @Body("token") token: string) {
    return this.apiResponse.success();
  }
}
