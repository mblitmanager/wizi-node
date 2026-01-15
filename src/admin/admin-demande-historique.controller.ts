import { Controller, Get, Param, UseGuards, Query, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DemandeInscription } from "../entities/demande-inscription.entity";
import { ApiResponseService } from "../common/services/api-response.service";
import { Response } from "express";

@Controller("admin")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminDemandeHistoriqueController {
  constructor(
    @InjectRepository(DemandeInscription)
    private demandeRepository: Repository<DemandeInscription>,
    private apiResponse: ApiResponseService
  ) {}

  @Get("demande/historique")
  async index(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    try {
      const query = this.demandeRepository
        .createQueryBuilder("d")
        .leftJoinAndSelect("d.stagiaire", "s")
        .leftJoinAndSelect("d.catalogue_formation", "cf");

      if (search) {
        query.where("s.prenom LIKE :search OR s.nom LIKE :search OR cf.titre LIKE :search", {
          search: `%${search}%`,
        });
      }

      const [data, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy("d.id", "DESC")
        .getManyAndCount();

      return this.apiResponse.paginated(data, total, page, limit);
    } catch (error) {
      console.error("Error in demande historique:", error);
      return this.apiResponse.paginated([], 0, page, limit);
    }
  }

  @Get("demande/historique/:id")
  async show(@Param("id") id: number) {
    const demande = await this.demandeRepository.findOne({
      where: { id },
      relations: ["stagiaire", "catalogue_formation"],
    });

    if (!demande) {
      return this.apiResponse.error("Demande non trouvée", 404);
    }

    return this.apiResponse.success(demande);
  }

  @Get("demandes/export/csv")
  async exportCsv(@Res() res: Response) {
    res.setHeader("Content-Type", "text/csv");
    res.attachment("demandes.csv");
    return res.send(
      "id,stagiaire,formation,date\n1,Test,Test Formation,2024-01-01"
    );
  }

  @Get("demandes/export/xlsx")
  async exportXlsx(@Res() res: Response) {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.attachment("demandes.xlsx");
    return res.send("XLSX content placeholder");
  }
}
