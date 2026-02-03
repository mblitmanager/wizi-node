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
  Query,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { InscriptionService } from "../inscription/inscription.service";
import { RankingService } from "../ranking/ranking.service";
import { StagiaireService } from "./stagiaire.service";
import { ApiResponseService } from "../common/services/api-response.service";
import { S3StorageService } from "../common/services/s3-storage.service";

@Controller("stagiaire")
@UseGuards(AuthGuard("jwt"))
export class StagiaireApiController {
  constructor(
    private inscriptionService: InscriptionService,
    private rankingService: RankingService,
    private stagiaireService: StagiaireService,
    private apiResponse: ApiResponseService,
    private s3Storage: S3StorageService,
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
    try {
      const userId = req.user.id;
      const stagiaire = await this.stagiaireService.getProfile(userId);

      if (!stagiaire) {
        return this.apiResponse.success({ data: [] });
      }

      const response = await this.stagiaireService.getFormationsByStagiaire(
        stagiaire.id,
      );

      return this.apiResponse.success({
        data: this.helpDataFormation(response),
      });
    } catch (error) {
      console.error("Erreur formations API:", error);
      return this.apiResponse.error(
        "Erreur lors de la récupération des formations.",
        500,
      );
    }
  }

  private helpDataFormation(response: any): any[] {
    const flatFormations = [];
    if (response && response.success && Array.isArray(response.data)) {
      for (const formationGroup of response.data) {
        if (Array.isArray(formationGroup.catalogue_formation)) {
          for (const catEntry of formationGroup.catalogue_formation) {
            flatFormations.push({
              formation: {
                id: formationGroup.id,
                titre: formationGroup.titre,
                description: formationGroup.description,
                statut: formationGroup.statut,
                duree: formationGroup.duree,
                categorie: formationGroup.categorie,
              },
              catalogue: {
                ...catEntry,
              },
              formateur: formationGroup.formateur || null,
              pivot: {
                date_debut: catEntry.date_debut || null,
                date_fin: catEntry.date_fin || null,
              },
              stats: formationGroup.stats || null,
            });
          }
        }
      }
    }
    return flatFormations;
  }

  @Get("formations/:formationId/classement")
  async formationClassement(@Param("formationId") formationId: number) {
    const data = await this.rankingService.getFormationRanking(formationId);
    return this.apiResponse.success(data);
  }

  @Post("inscription-catalogue-formation")
  async inscriptionCatalogueFormation(@Request() req: any, @Body() data: any) {
    try {
      if (!data.catalogue_formation_id) {
        return this.apiResponse.error(
          "Le champ catalogue_formation_id est requis.",
          400,
        );
      }
      return await this.inscriptionService.inscrire(
        req.user.id,
        data.catalogue_formation_id,
      );
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      return this.apiResponse.error(
        error.message || "Une erreur est survenue lors de l'inscription.",
        500,
      );
    }
  }

  @Post("onboarding-seen")
  async onboardingSeen(@Request() req: any) {
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
  async rankingGlobal(@Query("period") period: string = "all") {
    const data = await this.rankingService.getGlobalRanking(period);
    return this.apiResponse.success(data);
  }

  @Get("ranking/formation/:formationId")
  async rankingFormation(
    @Param("formationId") formationId: number,
    @Query("period") period: string = "all",
  ) {
    const data = await this.rankingService.getFormationRanking(
      formationId,
      period,
    );
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
    try {
      const response = await this.stagiaireService.getFormationsByStagiaire(id);
      return this.apiResponse.success({
        data: this.helpDataFormation(response),
      });
    } catch (error) {
      console.error(`Erreur userFormations API (${id}):`, error);
      return this.apiResponse.error(
        "Erreur lors de la récupération des formations du stagiaire.",
        500,
      );
    }
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
    private apiResponse: ApiResponseService,
    private s3Storage: S3StorageService,
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
      storage: memoryStorage(),
    }),
  )
  async updateAvatar(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) {
      return this.apiResponse.error("No image uploaded", 400);
    }

    const result = await this.s3Storage.uploadFile(file, "users");
    await this.stagiaireService.updateProfilePhoto(req.user.id, result.key);

    return this.apiResponse.success({
      message: "Avatar mis à jour",
      avatar: result.key,
      avatar_url: result.url,
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
