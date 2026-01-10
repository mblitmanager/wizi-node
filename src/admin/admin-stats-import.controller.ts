import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Res,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Response } from "express";

@Controller("administrateur/stats")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminStatsController {
  constructor() {}

  @Get("affluence")
  async affluence() {
    return { data: {}, message: "Affluence statistics" };
  }

  @Get("classement")
  async classement() {
    return { data: {}, message: "Classement statistics" };
  }

  @Get("par-catalogue")
  async parCatalogue() {
    return { data: {}, message: "Stats par catalogue" };
  }

  @Get("par-formateur")
  async parFormateur() {
    return { data: {}, message: "Stats par formateur" };
  }

  @Get("par-formation")
  async parFormation() {
    return { data: {}, message: "Stats par formation" };
  }

  @Get("stagiaires")
  async stagiaires(
    @Query("page") page = 1,
    @Query("limit") limit = 10
  ) {
    return {
      data: [],
      pagination: { total: 0, page, total_pages: 0 },
    };
  }

  @Get("stagiaires/export")
  async stagiaireExport(@Res() res: Response) {
    res.setHeader("Content-Type", "text/csv");
    res.send("CSV export");
  }

  @Get("stagiaires/export-xlsx")
  async stagiaireExportXlsx(@Res() res: Response) {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send("XLSX export");
  }
}

@Controller("administrateur/import")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminImportController {
  constructor() {}

  @Post("stagiaires")
  async importStagiaires(@Body() data: any) {
    return { message: "Stagiaires imported", data };
  }

  @Post("quiz")
  async importQuiz(@Body() data: any) {
    return { message: "Quiz imported", data };
  }

  @Post("formateur")
  async importFormateur(@Body() data: any) {
    return { message: "Formateur imported", data };
  }

  @Post("commercials")
  async importCommercials(@Body() data: any) {
    return { message: "Commercials imported", data };
  }

  @Post("prc")
  async importPrc(@Body() data: any) {
    return { message: "PRC imported", data };
  }

  @Get("status")
  async status() {
    return { status: "pending" };
  }

  @Get("reports")
  async reports() {
    return { data: [], message: "Import reports" };
  }

  @Get("report/:filename")
  async getReport() {
    return { message: "Report file" };
  }

  @Post("reports/purge")
  async purgeReports() {
    return { message: "Reports purged" };
  }

  @Post("quiz-question/new")
  async newQuizQuestion(@Body() data: any) {
    return { message: "Question created", data };
  }

  @Post("question-import")
  async questionImport(@Body() data: any) {
    return { message: "Questions imported", data };
  }
}

@Controller("administrateur")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminInactivityController {
  constructor() {}

  @Get("inactivity")
  async index() {
    return { data: [], message: "Inactive users" };
  }

  @Post("inactivity/notify")
  async notify() {
    return { message: "Notifications sent" };
  }

  @Get("user-app-usages")
  async userAppUsages(
    @Query("page") page = 1,
    @Query("limit") limit = 10
  ) {
    return {
      data: [],
      pagination: { total: 0, page, total_pages: 0 },
    };
  }

  @Get("user-app-usages/export")
  async userAppUsagesExport() {
    return { message: "Export data" };
  }

  @Get("telecharger-modele-commercial")
  async downloadCommercialModel(@Res() res: Response) {
    res.setHeader("Content-Type", "text/csv");
    res.send("CSV Template");
  }

  @Get("telecharger-modele-formateur")
  async downloadFormateurModel(@Res() res: Response) {
    res.setHeader("Content-Type", "text/csv");
    res.send("CSV Template");
  }

  @Get("telecharger-modele-prc")
  async downloadPrcModel(@Res() res: Response) {
    res.setHeader("Content-Type", "text/csv");
    res.send("CSV Template");
  }

  @Get("telecharger-modele-stagiaire")
  async downloadStagiaireModel(@Res() res: Response) {
    res.setHeader("Content-Type", "text/csv");
    res.send("CSV Template");
  }

  @Get("telecharger-modele-quiz")
  async downloadQuizModel(@Res() res: Response) {
    res.setHeader("Content-Type", "text/csv");
    res.send("CSV Template");
  }

  @Get("manual")
  async manual() {
    return { message: "Manual" };
  }
}
