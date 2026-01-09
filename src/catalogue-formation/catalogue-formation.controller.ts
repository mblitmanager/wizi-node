import { Controller, Get, Param } from "@nestjs/common";
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

  @Get("catalogueFormations/formations")
  async getAllFormations() {
    return this.catalogueService.findAll();
  }

  @Get("catalogueFormations/formations/:id")
  async getOne(@Param("id") id: number) {
    return this.catalogueService.findOne(id);
  }
}
