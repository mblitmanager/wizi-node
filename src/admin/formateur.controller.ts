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

  @Get("formations-videos")
  async getFormateurVideosByFormations(@Request() req: any) {
    const userId = req.user.id; // L'ID de l'utilisateur est disponible via le jeton JWT
    const formationsWithVideos = await this.adminService.getFormateurFormationsWithVideos(userId);
    return this.apiResponse.success(formationsWithVideos, "Vidéos par formation récupérées avec succès");
  }
}
