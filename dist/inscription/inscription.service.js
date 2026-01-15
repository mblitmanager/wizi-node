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
const stagiaire_catalogue_formation_entity_1 = require("../entities/stagiaire-catalogue-formation.entity");
const notification_service_1 = require("../notification/notification.service");
const mail_service_1 = require("../mail/mail.service");
const path_1 = require("path");
let InscriptionService = class InscriptionService {
    constructor(demandeRepository, stagiaireRepository, catalogueRepository, scfRepository, notificationService, mailService) {
        this.demandeRepository = demandeRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.catalogueRepository = catalogueRepository;
        this.scfRepository = scfRepository;
        this.notificationService = notificationService;
        this.mailService = mailService;
    }
    async inscrire(userId, catalogueFormationId) {
        try {
            const stagiaire = await this.stagiaireRepository.findOne({
                where: { user_id: userId },
                relations: ["stagiaire_catalogue_formations", "user"],
            });
            if (!stagiaire) {
                throw new Error("Aucun stagiaire associé à cet utilisateur.");
            }
            const catalogueFormation = await this.catalogueRepository.findOne({
                where: { id: catalogueFormationId },
            });
            if (!catalogueFormation) {
                throw new Error("Formation not found");
            }
            const alreadyEnrolled = stagiaire.stagiaire_catalogue_formations.some((scf) => scf.catalogue_formation_id === catalogueFormationId);
            if (!alreadyEnrolled) {
                const scf = this.scfRepository.create({
                    stagiaire_id: stagiaire.id,
                    catalogue_formation_id: catalogueFormationId,
                    date_inscription: new Date(),
                });
                await this.scfRepository.save(scf);
            }
            const demande = this.demandeRepository.create({
                parrain_id: null,
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
                lien_parrainage: null,
            });
            const savedDemande = await this.demandeRepository.save(demande);
            try {
                await this.notificationService.createNotification(userId, "inscription", "Nous avons bien reçu votre demande d'inscription, votre conseiller/conseillère va prendre contact avec vous.");
            }
            catch (notificationError) {
                console.warn("Erreur lors de l'envoi de la notification (inscription non affectée):", notificationError);
            }
            const emailPromises = [];
            emailPromises.push(this.mailService
                .sendMail(stagiaire.user.email, "Confirmation d'inscription à une formation - Wizi Learn", "inscription_catalogue", {
                firstName: stagiaire.prenom || stagiaire.user.name,
                lastName: stagiaire.user.name,
                civility: stagiaire.civilite || "Non renseigné",
                phone: stagiaire.telephone || "Non renseigné",
                email: stagiaire.user.email,
                formationTitle: catalogueFormation.titre,
                formationDuration: catalogueFormation.duree,
                formationPrice: catalogueFormation.tarif
                    ? new Intl.NumberFormat("fr-FR").format(catalogueFormation.tarif)
                    : null,
                prerequis: catalogueFormation.prerequis || null,
                isPoleRelation: false,
            }, [
                {
                    filename: "aopia.png",
                    path: (0, path_1.join)(process.cwd(), "src/mail/templates/assets/aopia.png"),
                    cid: "aopia",
                },
                {
                    filename: "like.png",
                    path: (0, path_1.join)(process.cwd(), "src/mail/templates/assets/like.png"),
                    cid: "like",
                },
            ])
                .catch((mailError) => {
                console.error("Failed to send inscription confirmation email:", mailError);
            }));
            const notificationEmails = [
                "adv@aopia.fr",
                "alexandre.florek@aopia.fr",
                "mbl.service.mada2@gmail.com",
            ];
            for (const email of notificationEmails) {
                emailPromises.push(this.mailService
                    .sendMail(email, "Nouvelle inscription à une formation - Wizi Learn", "inscription_catalogue", {
                    firstName: stagiaire.prenom || stagiaire.user.name,
                    lastName: stagiaire.user.name,
                    civility: stagiaire.civilite || "Non renseigné",
                    phone: stagiaire.telephone || "Non renseigné",
                    email: stagiaire.user.email,
                    formationTitle: catalogueFormation.titre,
                    formationDuration: catalogueFormation.duree,
                    formationPrice: catalogueFormation.tarif
                        ? new Intl.NumberFormat("fr-FR").format(catalogueFormation.tarif)
                        : null,
                    prerequis: catalogueFormation.prerequis || null,
                    isPoleRelation: true,
                }, [
                    {
                        filename: "aopia.png",
                        path: (0, path_1.join)(process.cwd(), "src/mail/templates/assets/aopia.png"),
                        cid: "aopia",
                    },
                    {
                        filename: "like.png",
                        path: (0, path_1.join)(process.cwd(), "src/mail/templates/assets/like.png"),
                        cid: "like",
                    },
                ])
                    .catch((mailError) => {
                    console.error(`Failed to send backoffice notification email to ${email}:`, mailError);
                }));
            }
            await Promise.all(emailPromises);
            return {
                success: true,
                message: "Un mail de confirmation vous a été envoyé, votre conseiller va bientôt prendre contact avec vous.",
                demande: savedDemande,
            };
        }
        catch (error) {
            console.error("Erreur lors de l'inscription au catalogue formation:", {
                user_id: userId,
                catalogue_formation_id: catalogueFormationId,
                error: error.message,
                stack: error.stack,
            });
            throw new Error(error.message || "Une erreur est survenue lors de l'inscription.");
        }
    }
};
exports.InscriptionService = InscriptionService;
exports.InscriptionService = InscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(demande_inscription_entity_1.DemandeInscription)),
    __param(1, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(2, (0, typeorm_1.InjectRepository)(catalogue_formation_entity_1.CatalogueFormation)),
    __param(3, (0, typeorm_1.InjectRepository)(stagiaire_catalogue_formation_entity_1.StagiaireCatalogueFormation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService,
        mail_service_1.MailService])
], InscriptionService);
//# sourceMappingURL=inscription.service.js.map