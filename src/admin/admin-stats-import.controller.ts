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
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("administrateur/stats")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminStatsController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get("affluence")
  async affluence() {
    return this.apiResponse.success({});
  }

  @Get("classement")
  async classement() {
    return this.apiResponse.success({});
  }

  @Get("par-catalogue")
  async parCatalogue() {
    return this.apiResponse.success({});
  }

  @Get("par-formateur")
  async parFormateur() {
    return this.apiResponse.success({});
  }

  @Get("par-formation")
  async parFormation() {
    return this.apiResponse.success({});
  }

  @Get("stagiaires")
  async stagiaires(
    @Query("page") page = 1,
    @Query("limit") limit = 10
  ) {
    return this.apiResponse.paginated([], 0, page, limit);
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
  constructor(private apiResponse: ApiResponseService) {}

  @Post("stagiaires")
  async importStagiaires(@Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Post("quiz")
  async importQuiz(@Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Post("formateur")
  async importFormateur(@Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Post("commercials")
  async importCommercials(@Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Post("prc")
  async importPrc(@Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Get("status")
  async status() {
    return this.apiResponse.success({ status: "pending" });
  }

  @Get("reports")
  async reports() {
    return this.apiResponse.success([]);
  }

  @Get("report/:filename")
  async getReport() {
    return this.apiResponse.success({});
  }

  @Post("reports/purge")
  async purgeReports() {
    return this.apiResponse.success();
  }

  @Post("quiz-question/new")
  async newQuizQuestion(@Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Post("question-import")
  async questionImport(@Body() data: any) {
    return this.apiResponse.success(data);
  }
}

@Controller("administrateur")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminInactivityController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get("inactivity")
  async index() {
    return this.apiResponse.success([]);
  }

  @Post("inactivity/notify")
  async notify() {
    return this.apiResponse.success();
  }

  @Get("user-app-usages")
  async userAppUsages(
    @Query("page") page = 1,
    @Query("limit") limit = 10
  ) {
    return this.apiResponse.paginated([], 0, page, limit);
  }

  @Get("user-app-usages/export")
  async userAppUsagesExport() {
    return this.apiResponse.success({});
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
    return this.apiResponse.success({});
  }
}
