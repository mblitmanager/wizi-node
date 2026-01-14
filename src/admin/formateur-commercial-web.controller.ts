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
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("formateur")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("formateur", "formatrice")
export class FormateurWebController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get("dashboard")
  async dashboard(@Request() req: any) {
    return this.apiResponse.success({
      user: req.user,
    });
  }

  @Get("catalogue")
  async catalogue() {
    return this.apiResponse.success({});
  }

  @Get("classement")
  async classement() {
    return this.apiResponse.success({});
  }

  @Get("formations/:id(\\d+)")
  async showFormation() {
    return this.apiResponse.success({});
  }

  @Get("profile")
  async profile(@Request() req: any) {
    return this.apiResponse.success({
      user: req.user,
    });
  }

  @Post("profile")
  async updateProfile(@Request() req: any, @Body() data: any) {
    return this.apiResponse.success({
      user: req.user,
    });
  }

  @Get("stagiaires/en-cours")
  async stagiaireEnCours() {
    return this.apiResponse.success([]);
  }

  @Get("stagiaires/termines")
  async stagiaireTermines() {
    return this.apiResponse.success([]);
  }

  @Get("stagiaires-application")
  async stagiaireApplication() {
    return this.apiResponse.success([]);
  }

  @Get("stagiaires/:id(\\d+)")
  async showStagiaire() {
    return this.apiResponse.success({});
  }

  @Get("stagiaires/:id/classement")
  async stagiaireClassement() {
    return this.apiResponse.success({});
  }

  @Get("stagiaires/stats")
  async stats() {
    return this.apiResponse.success({});
  }

  @Get("stagiaires/stats/export")
  async statsExport() {
    return this.apiResponse.success({});
  }

  @Get("stagiaires/stats/export-xlsx")
  async statsExportXlsx() {
    return this.apiResponse.success({});
  }

  @Get("stats/affluence")
  async affluence() {
    return this.apiResponse.success({});
  }

  @Get("stats/classement")
  async statsClassement() {
    return this.apiResponse.success({});
  }

  @Get("stats/par-formation")
  async statsParFormation() {
    return this.apiResponse.success({});
  }
}

@Controller("commercial")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("commercial")
export class CommercialWebController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get("dashboard")
  async dashboard(@Request() req: any) {
    return this.apiResponse.success({
      user: req.user,
    });
  }

  @Get("stats/affluence")
  async affluence() {
    return this.apiResponse.success({});
  }

  @Get("stats/classement")
  async classement() {
    return this.apiResponse.success({});
  }

  @Get("stats/par-formateur")
  async parFormateur() {
    return this.apiResponse.success({});
  }

  @Get("stats/par-formation")
  async parFormation() {
    return this.apiResponse.success({});
  }
}
