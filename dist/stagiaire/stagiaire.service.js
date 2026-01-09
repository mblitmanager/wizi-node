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
exports.StagiaireService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const classement_entity_1 = require("../entities/classement.entity");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
const formation_entity_1 = require("../entities/formation.entity");
let StagiaireService = class StagiaireService {
    constructor(stagiaireRepository, classementRepository, catalogueRepository, formationRepository) {
        this.stagiaireRepository = stagiaireRepository;
        this.classementRepository = classementRepository;
        this.catalogueRepository = catalogueRepository;
        this.formationRepository = formationRepository;
    }
    async getProfile(userId) {
        return this.stagiaireRepository.findOne({
            where: { user_id: userId },
            relations: ["user"],
        });
    }
    async getHomeData(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
            relations: [
                "user",
                "formateurs",
                "formateurs.user",
                "commercials",
                "commercials.user",
                "poleRelationClients",
                "poleRelationClients.user",
            ],
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException(`Stagiaire with user_id ${userId} not found`);
        }
        const quizStats = await this.classementRepository
            .createQueryBuilder("classement")
            .select("COUNT(*)", "total_quizzes")
            .addSelect("SUM(points)", "total_points")
            .addSelect("AVG(points)", "avg_score")
            .where("classement.stagiaire_id = :id", { id: stagiaire.id })
            .getRawOne();
        const recentHistory = await this.classementRepository.find({
            where: { stagiaire_id: stagiaire.id },
            relations: ["quiz"],
            order: { updated_at: "DESC" },
            take: 3,
        });
        const mapContact = (contact) => ({
            id: contact.id,
            prenom: contact.prenom,
            nom: contact.user?.name || contact.nom || "",
            email: contact.user?.email || contact.email || null,
            telephone: contact.telephone || null,
        });
        const formateurs = stagiaire.formateurs.map(mapContact);
        const commerciaux = stagiaire.commercials.map(mapContact);
        const poleRelation = stagiaire.poleRelationClients.map(mapContact);
        const catalogueFormations = await this.catalogueRepository.find({
            where: { statut: 1 },
            relations: ["formation"],
            take: 3,
        });
        const categoriesRaw = await this.formationRepository
            .createQueryBuilder("formation")
            .select("DISTINCT formation.categorie", "categorie")
            .where("formation.statut = :statut", { statut: "1" })
            .getRawMany();
        const categories = categoriesRaw.map((c) => c.categorie);
        return {
            user: {
                id: stagiaire.id,
                prenom: stagiaire.prenom,
                image: stagiaire.user?.image || null,
            },
            quiz_stats: {
                total_quizzes: parseInt(quizStats.total_quizzes) || 0,
                total_points: parseInt(quizStats.total_points) || 0,
                average_score: parseFloat(quizStats.avg_score) || 0,
            },
            recent_history: recentHistory,
            contacts: {
                formateurs,
                commerciaux,
                pole_relation: poleRelation,
            },
            catalogue_formations: catalogueFormations,
            categories,
        };
    }
    async getContacts(userId) {
        const data = await this.getHomeData(userId);
        return data.contacts;
    }
    async getContactsByType(userId, type) {
        const data = await this.getHomeData(userId);
        switch (type) {
            case "commercial":
                return data.contacts.commerciaux;
            case "formateur":
                return data.contacts.formateurs;
            case "pole-relation":
            case "pole-save":
                return data.contacts.pole_relation;
            default:
                return [];
        }
    }
    async getStagiaireQuizzes(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
        });
        if (!stagiaire)
            return [];
        return this.classementRepository.find({
            where: { stagiaire_id: stagiaire.id },
            relations: ["quiz"],
        });
    }
};
exports.StagiaireService = StagiaireService;
exports.StagiaireService = StagiaireService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(1, (0, typeorm_1.InjectRepository)(classement_entity_1.Classement)),
    __param(2, (0, typeorm_1.InjectRepository)(catalogue_formation_entity_1.CatalogueFormation)),
    __param(3, (0, typeorm_1.InjectRepository)(formation_entity_1.Formation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StagiaireService);
//# sourceMappingURL=stagiaire.service.js.map