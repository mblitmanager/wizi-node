import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { AdminService } from "./admin.service";

@Controller("formateur")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("formateur", "formatrice", "admin")
export class FormateurController {
  constructor(private readonly adminService: AdminService) {}

  @Get("dashboard/stats")
  async getDashboardStats(@Request() req) {
    return this.adminService.getFormateurDashboardStats(req.user.id);
  }

  @Get("stagiaires/online")
  async getOnlineStagiaires() {
    const stagiaires = await this.adminService.getOnlineStagiaires();
    return {
      stagiaires: stagiaires.map((s) => ({
        id: s.id,
        prenom: s.prenom,
        nom: s.user?.name,
        email: s.user?.email,
        last_activity_at: s.user?.last_activity_at,
        formations:
          s.stagiaire_catalogue_formations?.map(
            (scf) => scf.catalogue_formation?.titre
          ) || [],
      })),
      total: stagiaires.length,
    };
  }
}
