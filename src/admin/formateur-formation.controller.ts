import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { ApiResponseService } from "../common/services/api-response.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Formateur } from "../entities/formateur.entity";

@Controller("formateur/formations")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("formateur", "formatrice")
export class FormateurFormationController {
  constructor(
    @InjectRepository(CatalogueFormation)
    private catalogueFormationRepository: Repository<CatalogueFormation>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(Formateur)
    private formateurRepository: Repository<Formateur>,
    private apiResponse: ApiResponseService
  ) {}

  @Get("available")
  async getAvailable(@Request() req) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
      relations: ["stagiaires"],
    });

    if (!formateur) {
      throw new HttpException("Formateur non trouvé", HttpStatus.NOT_FOUND);
    }

    const formations = await this.catalogueFormationRepository
      .createQueryBuilder("cf")
      .leftJoinAndSelect("cf.medias", "media", "media.type = :type", {
        type: "video",
      })
      .loadRelationCountAndMap(
        "cf.stagiairesCount",
        "cf.stagiaires",
        "stagiaire",
        (qb) =>
          qb.innerJoin(
            "stagiaire.formateurs",
            "formateur",
            "formateur.id = :formateurId",
            { formateurId: formateur.id }
          )
      )
      .orderBy("cf.titre", "ASC")
      .getMany();

    const formationsData = formations.map((formation: any) => ({
      id: formation.id,
      titre: formation.titre,
      categorie: formation.categorie || "Général",
      description: formation.description,
      image: formation.image_url,
      nb_stagiaires: formation.stagiairesCount || 0,
      nb_videos: formation.medias?.length || 0,
      duree_estimee: formation.duree || 0,
    }));

    return this.apiResponse.success({ formations: formationsData });
  }

  @Get(":id/stagiaires")
  async getStagiairesByFormation(
    @Param("id") formationId: number,
    @Request() req
  ) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
    });

    const formation = await this.catalogueFormationRepository.findOne({
      where: { id: formationId },
      relations: ["medias"],
    });

    if (!formation) {
      throw new HttpException("Formation non trouvée", HttpStatus.NOT_FOUND);
    }

    const stagiaires = await this.stagiaireRepository
      .createQueryBuilder("s")
      .innerJoin("s.formateurs", "f", "f.id = :formateurId", {
        formateurId: formateur.id,
      })
      .innerJoin("s.catalogue_formations", "cf", "cf.id = :formationId", {
        formationId,
      })
      .leftJoinAndSelect("s.user", "user")
      .leftJoinAndSelect("s.mediaStagiaires", "ms")
      .getMany();

    const totalVideos =
      formation.formation?.medias?.filter((m) => m.type === "video").length ||
      0;

    const stagiairesData = stagiaires.map((stagiaire: any) => {
      const watchedCount = stagiaire.mediaStagiaires.filter((ms: any) =>
        formation.formation?.medias?.find((m) => m.id === ms.media_id)
      ).length;

      const completedVideos = stagiaire.mediaStagiaires.filter((ms: any) => {
        const media = formation.formation?.medias?.find(
          (m) => m.id === ms.media_id
        );
        return media?.type === "video" && ms.status === "completed";
      }).length;

      const progress =
        totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

      return {
        id: stagiaire.id,
        prenom: stagiaire.user?.prenom || "",
        nom: stagiaire.user?.nom || "",
        email: stagiaire.user?.email || "",
        date_debut: stagiaire.date_debut_formation,
        date_fin: stagiaire.date_fin_formation,
        progress,
        status: stagiaire.statut ? "active" : "inactive",
      };
    });

    return this.apiResponse.success({
      formation: {
        id: formation.id,
        titre: formation.titre,
        categorie: formation.categorie,
      },
      stagiaires: stagiairesData,
    });
  }

  @Post(":id/assign")
  async assignStagiaires(
    @Param("id") formationId: number,
    @Body() body: any,
    @Request() req
  ) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
      relations: ["stagiaires"],
    });

    const formation = await this.catalogueFormationRepository.findOne({
      where: { id: formationId },
    });

    if (!formation) {
      throw new HttpException("Formation non trouvée", HttpStatus.NOT_FOUND);
    }

    const stagiaireIds = body.stagiaire_ids || [];
    const dateDebut = body.date_debut || new Date();
    const dateFin = body.date_fin;

    // Verify stagiaires belong to formateur
    const stagiaires = await this.stagiaireRepository
      .createQueryBuilder("s")
      .innerJoin("s.formateurs", "f", "f.id = :formateurId", {
        formateurId: formateur.id,
      })
      .where("s.id IN (:...ids)", { ids: stagiaireIds })
      .leftJoinAndSelect("s.catalogue_formations", "cf")
      .getMany();

    if (stagiaires.length !== stagiaireIds.length) {
      throw new HttpException(
        "Certains stagiaires n'appartiennent pas à ce formateur",
        HttpStatus.FORBIDDEN
      );
    }

    let assigned = 0;
    for (const stagiaire of stagiaires) {
      // Check if stagiaire is assigned to this formation
      const alreadyAssigned = stagiaire.stagiaire_catalogue_formations?.some(
        (scf) => scf.catalogue_formation_id === formationId
      );

      if (!alreadyAssigned) {
        await this.catalogueFormationRepository
          .createQueryBuilder()
          .relation(CatalogueFormation, "stagiaires")
          .of(formationId)
          .add(stagiaire.id);
        assigned++;
      }

      // Update dates
      if (dateDebut) {
        stagiaire.date_debut_formation = dateDebut;
      }
      if (dateFin) {
        stagiaire.date_fin_formation = dateFin;
      }
      await this.stagiaireRepository.save(stagiaire);
    }

    return this.apiResponse.success({
      success: true,
      message: `${assigned} stagiaire(s) assigné(s) à la formation ${formation.titre}`,
      assigned_count: assigned,
    });
  }

  @Get("/stagiaires/unassigned/:formationId")
  async getUnassignedStagiaires(
    @Param("formationId") formationId: number,
    @Request() req
  ) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
      relations: [
        "stagiaires",
        "stagiaires.user",
        "stagiaires.catalogue_formations",
      ],
    });

    const unassigned = formateur.stagiaires.filter(
      (stagiaire: any) =>
        !stagiaire.catalogue_formations.some((cf: any) => cf.id == formationId)
    );

    const stagiairesData = unassigned.map((stagiaire: any) => ({
      id: stagiaire.id,
      prenom: stagiaire.user?.prenom || "",
      nom: stagiaire.user?.nom || "",
      email: stagiaire.user?.email || "",
    }));

    return this.apiResponse.success({ stagiaires: stagiairesData });
  }

  @Put(":id/schedule")
  async updateSchedule(
    @Param("id") formationId: number,
    @Body() body: any,
    @Request() req
  ) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
    });

    const stagiaireIds = body.stagiaire_ids || [];
    const dateDebut = body.date_debut;
    const dateFin = body.date_fin;

    const result = await this.stagiaireRepository
      .createQueryBuilder()
      .update()
      .set({
        date_debut_formation: dateDebut,
        date_fin_formation: dateFin,
      })
      .where("id IN (:...ids)", { ids: stagiaireIds })
      .andWhere(
        "id IN (SELECT stagiaire_id FROM formateur_stagiaire WHERE formateur_id = :formateurId)",
        { formateurId: formateur.id }
      )
      .execute();

    return this.apiResponse.success({
      success: true,
      message: `${result.affected} stagiaire(s) mis à jour`,
      updated_count: result.affected,
    });
  }

  @Get(":id/stats")
  async getFormationStats(@Param("id") formationId: number, @Request() req) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
    });

    const formation = await this.catalogueFormationRepository.findOne({
      where: { id: formationId },
      relations: ["medias"],
    });

    if (!formation) {
      throw new HttpException("Formation non trouvée", HttpStatus.NOT_FOUND);
    }

    const stagiaires = await this.stagiaireRepository
      .createQueryBuilder("s")
      .innerJoin("s.formateurs", "f", "f.id = :formateurId", {
        formateurId: formateur.id,
      })
      .innerJoin("s.catalogue_formations", "cf", "cf.id = :formationId", {
        formationId,
      })
      .leftJoinAndSelect("s.mediaStagiaires", "ms")
      .getMany();

    // Access medias and quizzes directly from the loaded formation entity
    const totalVideos =
      formation.medias?.filter((m) => m.type === "video").length || 0;
    const totalQuiz = formation.quizzes?.length || 0; // Assuming quizzes are on Formation

    const totalStagiaires = stagiaires.length;

    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    stagiaires.forEach((stagiaire: any) => {
      const watchedCount = stagiaire.mediaStagiaires.filter((ms: any) =>
        formation.medias.find((m) => m.id === ms.media_id)
      ).length;

      const progress =
        totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

      if (progress === 100) {
        completed++;
      } else if (progress > 0) {
        inProgress++;
      } else {
        notStarted++;
      }
    });

    return this.apiResponse.success({
      formation: {
        id: formation.id,
        titre: formation.titre,
        nb_videos: totalVideos,
      },
      stats: {
        total_stagiaires: totalStagiaires,
        completed,
        in_progress: inProgress,
        not_started: notStarted,
        completion_rate:
          totalStagiaires > 0
            ? Math.round((completed / totalStagiaires) * 100 * 10) / 10
            : 0,
      },
    });
  }
}
