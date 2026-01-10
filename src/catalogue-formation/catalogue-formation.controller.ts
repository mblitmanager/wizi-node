import { Controller, Get, Param, UseGuards, Request } from "@nestjs/common";
import { CatalogueFormationService } from "./catalogue-formation.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("catalogueFormations")
@UseGuards(AuthGuard("jwt"))
export class CatalogueFormationController {
  constructor(
    private readonly catalogueService: CatalogueFormationService,
    private readonly apiResponse: ApiResponseService
  ) {}

  @Get()
  async getAll() {
    // Laravel returns the array directly if not paginated
    return await this.catalogueService.findAll();
  }

  @Get("formations")
  async getAllFormations() {
    return await this.catalogueService.findAll();
  }

  @Get("with-formations")
  async getWithFormations(@Request() req: any) {
    // getCataloguesWithFormations returns the full paginated object
    return await this.catalogueService.getCataloguesWithFormations(req.query);
  }

  @Get("stagiaire")
  async getMyStagiaireCatalogues(@Request() req: any) {
    const stagiaireId = req.user.stagiaire?.id;
    if (!stagiaireId) {
      return this.apiResponse.error("Stagiaire not found for this user", 404);
    }
    return await this.catalogueService.getFormationsAndCatalogues(stagiaireId);
  }

  @Get("stagiaire/:id")
  async getStagiaireCatalogues(@Param("id") id: number) {
    return await this.catalogueService.getFormationsAndCatalogues(id);
  }

  @Get("formations/:id")
  async getOne(@Param("id") id: number) {
    const result = await this.catalogueService.findOne(id);
    // Laravel show returns the object directly
    return result;
  }

  @Get("formationParrainage")
  async getAllForParrainage() {
    return await this.catalogueService.findAll();
  }
}
