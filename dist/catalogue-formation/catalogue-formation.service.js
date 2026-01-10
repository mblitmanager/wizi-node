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
                formation: {
                    statut: 1,
                },
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
        const catalogues = stagiaire.stagiaire_catalogue_formations.map((scf) => {
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
        const stagiaireData = {
            ...stagiaire,
            catalogue_formations: stagiaire.stagiaire_catalogue_formations.map((scf) => ({
                ...scf.catalogue_formation,
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
            })),
        };
        delete stagiaireData.stagiaire_catalogue_formations;
        return {
            stagiaire: stagiaireData,
            catalogues: catalogues,
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