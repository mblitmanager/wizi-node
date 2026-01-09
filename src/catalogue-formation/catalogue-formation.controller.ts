import { Controller, Get } from "@nestjs/common";
import { CatalogueFormationService } from "./catalogue-formation.service";

@Controller()
export class CatalogueFormationController {
  constructor(private readonly catalogueService: CatalogueFormationService) {}

  @Get("formationParrainage")
  async getAllForParrainage() {
    return this.catalogueService.findAll();
  }

  @Get("catalogueFormations")
  async getAll() {
    return this.catalogueService.findAll();
  }
}
