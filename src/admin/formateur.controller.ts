import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { AdminService } from "./admin.service";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("formateur")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("formateur", "formatrice", "admin")
export class FormateurController {
  constructor(
    private readonly adminService: AdminService,
    private apiResponse: ApiResponseService
  ) {}

  @Get("dashboard/stats")
  async getDashboardStats(@Request() req) {
    const stats = await this.adminService.getFormateurDashboardStats(
      req.user.id
    );
    return this.apiResponse.success(stats);
  }

  @Get("stagiaires/online")
  async getOnlineStagiaires() {
    const stagiaires = await this.adminService.getOnlineStagiaires();
    const formatted = stagiaires.map((s) => ({
      id: s.id,
      prenom: s.prenom,
      nom: s.user?.name,
      email: s.user?.email,
      avatar: s.user?.image || null,
      last_activity_at: s.user?.last_activity_at
        ? new Date(
            new Date(s.user.last_activity_at).getTime() + 3 * 60 * 60 * 1000
          )
            .toISOString()
            .replace("T", " ")
            .substring(0, 19)
        : null,
      formations:
        s.stagiaire_catalogue_formations?.map(
          (scf) => scf.catalogue_formation?.titre
        ) || [],
    }));
    return this.apiResponse.success({
      stagiaires: formatted,
      total: formatted.length,
    });
  }
}
