import { Controller, Get, Param, UseGuards, Request } from "@nestjs/common";
import { CatalogueFormationService } from "./catalogue-formation.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("api")
@UseGuards(AuthGuard("jwt"))
export class CatalogueFormationController {
  constructor(
    private readonly catalogueService: CatalogueFormationService,
    private readonly apiResponse: ApiResponseService
  ) {}

  @Get("formationParrainage")
  async getAllForParrainage() {
    const result = await this.catalogueService.findAll();
    return this.apiResponse.success(result);
  }

  @Get("catalogueFormations")
  async getAll() {
    const result = await this.catalogueService.findAll();
    return this.apiResponse.success(result);
  }

  @Get("catalogueFormations/formations")
  async getAllFormations() {
    const result = await this.catalogueService.findAll();
    return this.apiResponse.success(result);
  }

  @Get("catalogueFormations/formations/:id")
  async getOne(@Param("id") id: number) {
    const result = await this.catalogueService.findOne(id);
    return this.apiResponse.success(result);
  }

  @Get("catalogueFormations/stagiaire")
  async getMyStagiaireCatalogues(@Request() req: any) {
    // Get stagiaire ID from authenticated user
    const stagiaireId = req.user.stagiaire?.id;
    if (!stagiaireId) {
      return this.apiResponse.error("Stagiaire not found for this user", 404);
    }
    const result =
      await this.catalogueService.getFormationsAndCatalogues(stagiaireId);
    return this.apiResponse.success(result);
  }

  @Get("catalogueFormations/stagiaire/:id")
  async getStagiaireCatalogues(@Param("id") id: number) {
    const result = await this.catalogueService.getFormationsAndCatalogues(id);
    return this.apiResponse.success(result);
  }
}
