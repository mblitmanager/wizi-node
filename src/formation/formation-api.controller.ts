import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FormationService } from "./formation.service";

@Controller("formation")
export class FormationApiController {
  constructor(private formationService: FormationService) {}

  @Get("categories")
  async getCategories() {
    return this.formationService.getCategories();
  }

  @Get("listFormation")
  async listFormations(@Query("page") page: string, @Request() req: any) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return this.formationService.listFormations({
      page: parseInt(page) || 1,
      baseUrl,
    });
  }
}
