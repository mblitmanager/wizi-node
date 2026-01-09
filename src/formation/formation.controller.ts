import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FormationService } from "./formation.service";

@Controller("catalogueFormations")
export class FormationController {
  constructor(private formationService: FormationService) {}

  @Get()
  async getAllFormations() {
    return this.formationService.getAllFormations();
  }

  @Get("catalogue")
  async getAllCatalogue() {
    return this.formationService.getAllCatalogueFormations();
  }

  @Get("formations")
  async getAllFormationsAlias() {
    return this.formationService.getAllCatalogueFormations();
  }
}
