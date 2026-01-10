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

@Controller("api/stagiaire")
@UseGuards(AuthGuard("jwt"))
export class StagiaireApiController {
  constructor(private inscriptionService: InscriptionService) {}

  @Get("profile")
  async profile(@Request() req: any) {
    return { user: req.user, message: "User profile" };
  }

  @Put("profile")
  async updateProfile(@Request() req: any, @Body() data: any) {
    return { user: req.user, message: "Profile updated" };
  }

  @Patch("profile")
  async patchProfile(@Request() req: any, @Body() data: any) {
    return { user: req.user, message: "Profile updated" };
  }

  @Post("profile/photo")
  async uploadProfilePhoto(@Request() req: any, @Body() data: any) {
    return { message: "Photo uploaded" };
  }

  @Get("show")
  async show(@Request() req: any) {
    return { user: req.user };
  }

  @Get("dashboard/home")
  async dashboardHome(@Request() req: any) {
    return { message: "Dashboard home", user: req.user };
  }

  @Get("formations")
  async formations(@Request() req: any) {
    return { data: [], message: "My formations" };
  }

  @Get("formations/:formationId/classement")
  async formationClassement() {
    return { data: [], message: "Formation ranking" };
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
    return { message: "Onboarding marked as seen" };
  }

  @Get("achievements")
  async achievements(@Request() req: any) {
    return { data: [], message: "My achievements" };
  }

  @Get("achievements/all")
  async allAchievements() {
    return { data: [], message: "All achievements" };
  }

  @Post("achievements/check")
  async checkAchievements() {
    return { message: "Achievements checked" };
  }

  @Get("contacts")
  async contacts() {
    return { data: [], message: "My contacts" };
  }

  @Get("contacts/commerciaux")
  async contactsCommerciaux() {
    return { data: [], message: "Commercial contacts" };
  }

  @Get("contacts/formateurs")
  async contactsFormateurs() {
    return { data: [], message: "Formateur contacts" };
  }

  @Get("contacts/pole-relation")
  async contactsPoleRelation() {
    return { data: [], message: "Pole relation contacts" };
  }

  @Get("contacts/pole-save")
  async contactsPoleSave() {
    return { data: [], message: "Pole save contacts" };
  }

  @Get("progress")
  async progress() {
    return { data: {}, message: "My progress" };
  }

  @Get("quizzes")
  async quizzes() {
    return { data: [], message: "My quizzes" };
  }

  @Get("ranking/global")
  async rankingGlobal() {
    return { data: [], message: "Global ranking" };
  }

  @Get("ranking/formation/:formationId")
  async rankingFormation() {
    return { data: [], message: "Formation ranking" };
  }

  @Get("rewards")
  async rewards() {
    return { data: [], message: "My rewards" };
  }

  @Get("partner")
  async partner() {
    return { data: {}, message: "My partner" };
  }

  @Get("parrainage/stats")
  async parainageStats() {
    return { data: {}, message: "Parrainage stats" };
  }

  @Get("parrainage/history")
  async parainageHistory() {
    return { data: [], message: "Parrainage history" };
  }

  @Get("parrainage/filleuls")
  async parainageFilleuls() {
    return { data: [], message: "My filleuls" };
  }

  @Get("parrainage/rewards")
  async parainageRewards() {
    return { data: [], message: "Parrainage rewards" };
  }

  @Post("parrainage/accept")
  async parainageAccept(@Body() data: any) {
    return { message: "Parrainage accepted" };
  }

  @Get(":id/formations")
  async userFormations(@Param("id") id: number) {
    return { data: [], message: "User formations" };
  }

  @Get(":id/catalogueFormations")
  async userCatalogueFormations(@Param("id") id: number) {
    return { data: [], message: "User catalogue formations" };
  }
}

@Controller("api")
@UseGuards(AuthGuard("jwt"))
export class ApiGeneralController {
  constructor() {}

  @Get("user")
  async getUser(@Request() req: any) {
    return { user: req.user };
  }

  @Get("me")
  async getMe(@Request() req: any) {
    return { user: req.user };
  }

  @Get("user/settings")
  async getUserSettings(@Request() req: any) {
    return { settings: {}, user: req.user };
  }

  @Put("user/settings")
  async updateUserSettings(@Request() req: any, @Body() data: any) {
    return { settings: data, message: "Settings updated" };
  }

  @Post("user-app-usage")
  async reportUserAppUsage(@Request() req: any, @Body() data: any) {
    return { message: "Usage reported" };
  }

  @Post("user/photo")
  async updateUserPhoto(@Request() req: any, @Body() data: any) {
    return { message: "Photo updated" };
  }

  @Get("users/me/points")
  async getUserPoints(@Request() req: any) {
    return { points: 0, user: req.user };
  }

  @Post("fcm-token")
  async updateFcmToken(@Request() req: any, @Body("token") token: string) {
    return { message: "FCM token updated" };
  }
}
