import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FormationService } from "./formation.service";

@Controller("catalogueFormations")
@UseGuards(AuthGuard("jwt"))
export class FormationController {
  constructor(private formationService: FormationService) {}

  @Get()
  async getAllFormations() {
    return this.formationService.getAllCatalogueFormations();
  }

  @Get("catalogue")
  async getAllCatalogue() {
    return this.formationService.getAllCatalogueFormations();
  }

  @Get("formations")
  async getAllFormationsAlias() {
    return this.formationService.getAllCatalogueFormations();
  }

  @Get("with-formations")
  async getWithFormations(@Request() req: any) {
    return this.formationService.getCataloguesWithFormations(req.query);
  }

  @Get("stagiaire")
  async getStagiaireFormations(@Request() req: any) {
    // Assuming req.user.stagiaire.id is available from JwtStrategy
    const stagiaireId = req.user.stagiaire?.id;
    if (!stagiaireId) {
      return [];
    }
    return this.formationService.getFormationsAndCatalogues(stagiaireId);
  }
}
