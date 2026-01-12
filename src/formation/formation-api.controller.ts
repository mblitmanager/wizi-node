import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FormationService } from "./formation.service";

@Controller(["formation", "formations"])
export class FormationApiController {
  constructor(private formationService: FormationService) {}

  @Get("categories")
  async getCategories() {
    return this.formationService.getCategories();
  }

  @Get("categories/:category")
  async getFormationsByCategory(@Param("category") category: string) {
    return this.formationService.getFormationsByCategory(category);
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
