"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormateurFormationController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const api_response_service_1 = require("../common/services/api-response.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const formateur_entity_1 = require("../entities/formateur.entity");
let FormateurFormationController = class FormateurFormationController {
    constructor(catalogueFormationRepository, stagiaireRepository, formateurRepository, apiResponse) {
        this.catalogueFormationRepository = catalogueFormationRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.formateurRepository = formateurRepository;
        this.apiResponse = apiResponse;
    }
    async getAvailable(req) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
            relations: ["stagiaires"],
        });
        if (!formateur) {
            throw new common_1.HttpException("Formateur non trouvé", common_1.HttpStatus.NOT_FOUND);
        }
        const formations = await this.catalogueFormationRepository
            .createQueryBuilder("cf")
            .leftJoinAndSelect("cf.medias", "media", "media.type = :type", {
            type: "video",
        })
            .leftJoinAndSelect("cf.formation", "formation")
            .loadRelationCountAndMap("cf.stagiairesCount", "cf.stagiaires", "stagiaire", (qb) => qb.innerJoin("stagiaire.formateurs", "formateur", "formateur.id = :formateurId", { formateurId: formateur.id }))
            .orderBy("cf.titre", "ASC")
            .getMany();
        const formationsData = formations.map((formation) => ({
            id: formation.id,
            titre: formation.titre,
            categorie: formation.formation?.categorie || "Général",
            description: formation.description,
            image: formation.image_url,
            nb_stagiaires: formation.stagiairesCount || 0,
            nb_videos: formation.medias?.length || 0,
            duree_estimee: formation.duree || 0,
        }));
        return this.apiResponse.success({ formations: formationsData });
    }
    async getStagiairesByFormation(formationId, req) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
        });
        const formation = await this.catalogueFormationRepository.findOne({
            where: { id: formationId },
            relations: ["medias"],
        });
        if (!formation) {
            throw new common_1.HttpException("Formation non trouvée", common_1.HttpStatus.NOT_FOUND);
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
        const totalVideos = formation.formation?.medias?.filter((m) => m.type === "video").length ||
            0;
        const stagiairesData = stagiaires.map((stagiaire) => {
            const watchedCount = stagiaire.mediaStagiaires.filter((ms) => formation.formation?.medias?.find((m) => m.id === ms.media_id)).length;
            const completedVideos = stagiaire.mediaStagiaires.filter((ms) => {
                const media = formation.formation?.medias?.find((m) => m.id === ms.media_id);
                return media?.type === "video" && ms.status === "completed";
            }).length;
            const progress = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
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
                categorie: formation.formation?.categorie || "Général",
            },
            stagiaires: stagiairesData,
        });
    }
    async assignStagiaires(formationId, body, req) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
            relations: ["stagiaires"],
        });
        const formation = await this.catalogueFormationRepository.findOne({
            where: { id: formationId },
        });
        if (!formation) {
            throw new common_1.HttpException("Formation non trouvée", common_1.HttpStatus.NOT_FOUND);
        }
        const stagiaireIds = body.stagiaire_ids || [];
        const dateDebut = body.date_debut || new Date();
        const dateFin = body.date_fin;
        const stagiaires = await this.stagiaireRepository
            .createQueryBuilder("s")
            .innerJoin("s.formateurs", "f", "f.id = :formateurId", {
            formateurId: formateur.id,
        })
            .where("s.id IN (:...ids)", { ids: stagiaireIds })
            .leftJoinAndSelect("s.catalogue_formations", "cf")
            .getMany();
        if (stagiaires.length !== stagiaireIds.length) {
            throw new common_1.HttpException("Certains stagiaires n'appartiennent pas à ce formateur", common_1.HttpStatus.FORBIDDEN);
        }
        let assigned = 0;
        for (const stagiaire of stagiaires) {
            const alreadyAssigned = stagiaire.stagiaire_catalogue_formations?.some((scf) => scf.catalogue_formation_id === formationId);
            if (!alreadyAssigned) {
                await this.catalogueFormationRepository
                    .createQueryBuilder()
                    .relation(catalogue_formation_entity_1.CatalogueFormation, "stagiaires")
                    .of(formationId)
                    .add(stagiaire.id);
                assigned++;
            }
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
    async getUnassignedStagiaires(formationId, req) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
            relations: [
                "stagiaires",
                "stagiaires.user",
                "stagiaires.catalogue_formations",
            ],
        });
        const unassigned = formateur.stagiaires.filter((stagiaire) => !stagiaire.catalogue_formations.some((cf) => cf.id == formationId));
        const stagiairesData = unassigned.map((stagiaire) => ({
            id: stagiaire.id,
            prenom: stagiaire.user?.prenom || "",
            nom: stagiaire.user?.nom || "",
            email: stagiaire.user?.email || "",
        }));
        return this.apiResponse.success({ stagiaires: stagiairesData });
    }
    async updateSchedule(formationId, body, req) {
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
            .andWhere("id IN (SELECT stagiaire_id FROM formateur_stagiaire WHERE formateur_id = :formateurId)", { formateurId: formateur.id })
            .execute();
        return this.apiResponse.success({
            success: true,
            message: `${result.affected} stagiaire(s) mis à jour`,
            updated_count: result.affected,
        });
    }
    async getFormationStats(formationId, req) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
        });
        const formation = await this.catalogueFormationRepository.findOne({
            where: { id: formationId },
            relations: ["medias"],
        });
        if (!formation) {
            throw new common_1.HttpException("Formation non trouvée", common_1.HttpStatus.NOT_FOUND);
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
        const formationEntity = formation.formation;
        const totalVideos = formationEntity?.medias?.filter((m) => m.type === "video").length || 0;
        const totalQuiz = formationEntity?.quizzes?.length || 0;
        const totalStagiaires = stagiaires.length;
        let completed = 0;
        let inProgress = 0;
        let notStarted = 0;
        stagiaires.forEach((stagiaire) => {
            const watchedCount = stagiaire.mediaStagiaires.filter((ms) => formationEntity?.medias?.find((m) => m.id === ms.media_id)).length;
            const progress = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
            if (progress === 100) {
                completed++;
            }
            else if (progress > 0) {
                inProgress++;
            }
            else {
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
                completion_rate: totalStagiaires > 0
                    ? Math.round((completed / totalStagiaires) * 100 * 10) / 10
                    : 0,
            },
        });
    }
};
exports.FormateurFormationController = FormateurFormationController;
__decorate([
    (0, common_1.Get)("available"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurFormationController.prototype, "getAvailable", null);
__decorate([
    (0, common_1.Get)(":id/stagiaires"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurFormationController.prototype, "getStagiairesByFormation", null);
__decorate([
    (0, common_1.Post)(":id/assign"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], FormateurFormationController.prototype, "assignStagiaires", null);
__decorate([
    (0, common_1.Get)("/stagiaires/unassigned/:formationId"),
    __param(0, (0, common_1.Param)("formationId")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurFormationController.prototype, "getUnassignedStagiaires", null);
__decorate([
    (0, common_1.Put)(":id/schedule"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], FormateurFormationController.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.Get)(":id/stats"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurFormationController.prototype, "getFormationStats", null);
exports.FormateurFormationController = FormateurFormationController = __decorate([
    (0, common_1.Controller)("formateur/formations"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("formateur", "formatrice"),
    __param(0, (0, typeorm_1.InjectRepository)(catalogue_formation_entity_1.CatalogueFormation)),
    __param(1, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(2, (0, typeorm_1.InjectRepository)(formateur_entity_1.Formateur)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], FormateurFormationController);
//# sourceMappingURL=formateur-formation.controller.js.map