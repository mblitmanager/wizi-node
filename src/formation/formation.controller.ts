import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FormationService } from "./formation.service";

@Controller("formations")
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
}
