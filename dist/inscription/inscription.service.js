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
exports.InscriptionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const demande_inscription_entity_1 = require("../entities/demande-inscription.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
const notification_service_1 = require("../notification/notification.service");
let InscriptionService = class InscriptionService {
    constructor(demandeRepository, stagiaireRepository, catalogueRepository, notificationService) {
        this.demandeRepository = demandeRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.catalogueRepository = catalogueRepository;
        this.notificationService = notificationService;
    }
    async inscrire(userId, catalogueFormationId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
            relations: ["catalogue_formations", "user"],
        });
        if (!stagiaire) {
            throw new Error("Stagiaire not found");
        }
        const catalogueFormation = await this.catalogueRepository.findOne({
            where: { id: catalogueFormationId },
        });
        if (!catalogueFormation) {
            throw new Error("Formation not found");
        }
        const alreadyEnrolled = stagiaire.catalogue_formations.some((cf) => cf.id === catalogueFormationId);
        if (!alreadyEnrolled) {
            stagiaire.catalogue_formations.push(catalogueFormation);
            await this.stagiaireRepository.save(stagiaire);
        }
        const demande = this.demandeRepository.create({
            parrain_id: userId,
            filleul_id: userId,
            formation_id: catalogueFormationId,
            statut: "en_attente",
            date_demande: new Date(),
            date_inscription: new Date(),
            motif: "Demande d'inscription à une formation",
            donnees_formulaire: JSON.stringify({
                type: "inscription_directe",
                formation_id: catalogueFormationId,
                date: new Date().toISOString(),
                user_id: userId,
            }),
        });
        const savedDemande = await this.demandeRepository.save(demande);
        await this.notificationService.createNotification(userId, "inscription", "Nous avons bien reçu votre demande d'inscription, votre conseiller/conseillère va prendre contact avec vous.");
        return {
            success: true,
            message: "Un mail de confirmation vous a été envoyé, votre conseiller va bientôt prendre contact avec vous.",
            demande: savedDemande,
        };
    }
};
exports.InscriptionService = InscriptionService;
exports.InscriptionService = InscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(demande_inscription_entity_1.DemandeInscription)),
    __param(1, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(2, (0, typeorm_1.InjectRepository)(catalogue_formation_entity_1.CatalogueFormation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], InscriptionService);
//# sourceMappingURL=inscription.service.js.map