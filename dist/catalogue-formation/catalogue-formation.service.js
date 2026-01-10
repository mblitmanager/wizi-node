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
exports.CatalogueFormationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
let CatalogueFormationService = class CatalogueFormationService {
    constructor(catalogueRepository, stagiaireRepository) {
        this.catalogueRepository = catalogueRepository;
        this.stagiaireRepository = stagiaireRepository;
    }
    async findAll() {
        return this.catalogueRepository.find({
            where: {
                statut: 1,
            },
            relations: ["formation"],
            order: {
                created_at: "DESC",
            },
        });
    }
    async findOne(id) {
        try {
            const formation = await this.catalogueRepository.findOne({
                where: { id },
                relations: [
                    "formation",
                    "formateurs",
                    "stagiaire_catalogue_formations",
                    "stagiaire_catalogue_formations.stagiaire",
                ],
            });
            if (!formation) {
                throw new common_1.NotFoundException("Catalogue formation not found");
            }
            return formation;
        }
        catch (error) {
            console.error("Detailed Error in CatalogueFormationService.findOne:", error);
            throw error;
        }
    }
    async getCataloguesWithFormations(query) {
        const perPage = Number(query.per_page) || 9;
        const page = Number(query.page) || 1;
        const category = query.category;
        const search = query.search;
        const queryBuilder = this.catalogueRepository
            .createQueryBuilder("catalogue")
            .leftJoinAndSelect("catalogue.formation", "formation")
            .leftJoin("catalogue.stagiaire_catalogue_formations", "scf")
            .loadRelationCountAndMap("catalogue.stagiaires_count", "catalogue.stagiaire_catalogue_formations")
            .where("catalogue.statut = :statut", { statut: 1 });
        if (category && category !== "Tous") {
            queryBuilder.andWhere("formation.categorie = :category", { category });
        }
        if (search) {
            queryBuilder.andWhere("(catalogue.titre LIKE :search OR catalogue.description LIKE :search)", { search: `%${search}%` });
        }
        const [items, total] = await queryBuilder
            .take(perPage)
            .skip((page - 1) * perPage)
            .orderBy("catalogue.created_at", "DESC")
            .getManyAndCount();
        const lastPage = Math.ceil(total / perPage);
        return {
            data: items.map((item) => ({
                id: item.id,
                titre: item.titre,
                description: item.description,
                prerequis: item.prerequis,
                image_url: item.image_url,
                cursus_pdf: item.cursus_pdf,
                tarif: item.tarif,
                certification: item.certification,
                statut: item.statut,
                duree: item.duree,
                created_at: item.created_at,
                updated_at: item.updated_at,
                cursusPdfUrl: item.cursus_pdf ? `storage/${item.cursus_pdf}` : null,
                formation: item.formation
                    ? {
                        id: item.formation.id,
                        titre: item.formation.titre,
                        description: item.formation.description,
                        categorie: item.formation.categorie,
                        duree: item.formation.duree,
                        image_url: item.formation.image,
                        statut: item.formation.statut,
                    }
                    : null,
                stagiaires_count: item.stagiaires_count || 0,
            })),
            current_page: page,
            last_page: lastPage,
            total,
            per_page: perPage,
        };
    }
    async getFormationsAndCatalogues(stagiaireId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id: stagiaireId },
            relations: [
                "stagiaire_catalogue_formations",
                "stagiaire_catalogue_formations.catalogue_formation",
                "stagiaire_catalogue_formations.catalogue_formation.formation",
            ],
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException("Stagiaire introuvable");
        }
        const result = stagiaire.stagiaire_catalogue_formations.map((scf) => {
            const catalogue = scf.catalogue_formation;
            const formation = catalogue.formation;
            return {
                pivot: {
                    stagiaire_id: scf.stagiaire_id,
                    catalogue_formation_id: scf.catalogue_formation_id,
                    date_debut: scf.date_debut,
                    date_inscription: scf.date_inscription,
                    date_fin: scf.date_fin,
                    formateur_id: scf.formateur_id,
                    created_at: scf.created_at,
                    updated_at: scf.updated_at,
                },
                catalogue: {
                    ...catalogue,
                    formation: formation,
                },
                formation: formation,
            };
        });
        return {
            stagiaire: stagiaire,
            catalogues: result,
        };
    }
};
exports.CatalogueFormationService = CatalogueFormationService;
exports.CatalogueFormationService = CatalogueFormationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(catalogue_formation_entity_1.CatalogueFormation)),
    __param(1, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CatalogueFormationService);
//# sourceMappingURL=catalogue-formation.service.js.map