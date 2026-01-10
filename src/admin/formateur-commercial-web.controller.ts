import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";

@Controller("formateur")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("formateur")
export class FormateurWebController {
  constructor() {}

  @Get("dashboard")
  async dashboard(@Request() req: any) {
    return {
      message: "Formateur Dashboard",
      user: req.user,
    };
  }

  @Get("catalogue")
  async catalogue() {
    return { message: "Catalogue de formations" };
  }

  @Get("classement")
  async classement() {
    return { message: "Classement des stagiaires" };
  }

  @Get("formations")
  async formations() {
    return { data: [], message: "Mes formations" };
  }

  @Get("formations/:id")
  async showFormation() {
    return { message: "Formation details" };
  }

  @Get("profile")
  async profile(@Request() req: any) {
    return {
      message: "Formateur Profile",
      user: req.user,
    };
  }

  @Post("profile")
  async updateProfile(@Request() req: any, @Body() data: any) {
    return {
      message: "Profile updated",
      user: req.user,
    };
  }

  @Get("stagiaires")
  async stagiaires() {
    return { data: [], message: "Tous les stagiaires" };
  }

  @Get("stagiaires/en-cours")
  async stagiaireEnCours() {
    return { data: [], message: "Stagiaires en cours" };
  }

  @Get("stagiaires/termines")
  async stagiaireTermines() {
    return { data: [], message: "Stagiaires terminés" };
  }

  @Get("stagiaires-application")
  async stagiaireApplication() {
    return { data: [], message: "Stagiaires application" };
  }

  @Get("stagiaires/:id")
  async showStagiaire() {
    return { message: "Stagiaire details" };
  }

  @Get("stagiaires/:id/classement")
  async stagiaireClassement() {
    return { message: "Stagiaire classement details" };
  }

  @Get("stagiaires/stats")
  async stats() {
    return { data: {}, message: "Statistics" };
  }

  @Get("stagiaires/stats/export")
  async statsExport() {
    return { message: "Export CSV" };
  }

  @Get("stagiaires/stats/export-xlsx")
  async statsExportXlsx() {
    return { message: "Export XLSX" };
  }

  @Get("stats/affluence")
  async affluence() {
    return { data: {}, message: "Affluence stats" };
  }

  @Get("stats/classement")
  async statsClassement() {
    return { data: {}, message: "Classement stats" };
  }

  @Get("stats/par-formation")
  async statsParFormation() {
    return { data: {}, message: "Stats par formation" };
  }
}

@Controller("commercial")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("commercial")
export class CommercialWebController {
  constructor() {}

  @Get("dashboard")
  async dashboard(@Request() req: any) {
    return {
      message: "Commercial Dashboard",
      user: req.user,
    };
  }

  @Get("stats/affluence")
  async affluence() {
    return { data: {}, message: "Affluence stats" };
  }

  @Get("stats/classement")
  async classement() {
    return { data: {}, message: "Classement stats" };
  }

  @Get("stats/par-formateur")
  async parFormateur() {
    return { data: {}, message: "Stats par formateur" };
  }

  @Get("stats/par-formation")
  async parFormation() {
    return { data: {}, message: "Stats par formation" };
  }
}
