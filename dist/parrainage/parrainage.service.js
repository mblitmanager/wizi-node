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
exports.ParrainageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const parrainage_entity_1 = require("../entities/parrainage.entity");
const parrainage_token_entity_1 = require("../entities/parrainage-token.entity");
const parrainage_event_entity_1 = require("../entities/parrainage-event.entity");
const user_entity_1 = require("../entities/user.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const demande_inscription_entity_1 = require("../entities/demande-inscription.entity");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
const mail_service_1 = require("../mail/mail.service");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
let ParrainageService = class ParrainageService {
    constructor(parrainageRepository, parrainageTokenRepository, parrainageEventRepository, userRepository, stagiaireRepository, demandeInscriptionRepository, catalogueFormationRepository, dataSource, mailService) {
        this.parrainageRepository = parrainageRepository;
        this.parrainageTokenRepository = parrainageTokenRepository;
        this.parrainageEventRepository = parrainageEventRepository;
        this.userRepository = userRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.demandeInscriptionRepository = demandeInscriptionRepository;
        this.catalogueFormationRepository = catalogueFormationRepository;
        this.dataSource = dataSource;
        this.mailService = mailService;
    }
    async registerFilleul(data) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const email = data.email ||
                `temp_${crypto.randomBytes(5).toString("hex")}@parrainage.com`;
            const existingUser = await queryRunner.manager.findOne(user_entity_1.User, {
                where: { email },
            });
            if (existingUser) {
                throw new common_1.BadRequestException("Cette adresse e-mail est déjà utilisée.");
            }
            const user = queryRunner.manager.create(user_entity_1.User, {
                name: data.nom || `Filleul ${crypto.randomBytes(3).toString("hex")}`,
                email: email,
                password: await bcrypt.hash(crypto.randomBytes(8).toString("hex"), 10),
                role: "stagiaire",
            });
            const savedUser = await queryRunner.manager.save(user_entity_1.User, user);
            const stagiaire = queryRunner.manager.create(stagiaire_entity_1.Stagiaire, {
                user_id: savedUser.id,
                civilite: data.civilite,
                prenom: data.prenom,
                telephone: data.telephone,
                adresse: data.adresse,
                code_postal: data.code_postal,
                ville: data.ville,
                date_naissance: data.date_naissance
                    ? new Date(data.date_naissance)
                    : null,
                date_debut_formation: data.date_debut_formation
                    ? new Date(data.date_debut_formation)
                    : null,
                date_inscription: data.date_inscription
                    ? new Date(data.date_inscription)
                    : new Date(),
                statut: data.statut || "en_attente",
            });
            const savedStagiaire = await queryRunner.manager.save(stagiaire_entity_1.Stagiaire, stagiaire);
            const parrainage = queryRunner.manager.create(parrainage_entity_1.Parrainage, {
                parrain_id: data.parrain_id,
                filleul_id: savedUser.id,
                date_parrainage: new Date(),
                points: 2,
                gains: 50.0,
            });
            await queryRunner.manager.save(parrainage_entity_1.Parrainage, parrainage);
            if (data.catalogue_formation_id) {
                await queryRunner.manager.insert("stagiaire_catalogue_formations", {
                    stagiaire_id: savedStagiaire.id,
                    catalogue_formation_id: data.catalogue_formation_id,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }
            const demande = queryRunner.manager.create(demande_inscription_entity_1.DemandeInscription, {
                parrain_id: data.parrain_id,
                filleul_id: savedUser.id,
                formation_id: data.catalogue_formation_id,
                statut: "complete",
                donnees_formulaire: JSON.stringify(data),
                lien_parrainage: data.lien_parrainage,
                motif: data.motif,
                date_demande: new Date(),
                date_inscription: new Date(),
            });
            await queryRunner.manager.save(demande_inscription_entity_1.DemandeInscription, demande);
            await queryRunner.commitTransaction();
            try {
                await this.mailService.sendMail(savedUser.email, "Confirmation d'inscription - Wizi Learn", "confirmation", { name: savedStagiaire.prenom || savedUser.name });
            }
            catch (mailError) {
                console.error("Failed to send confirmation email:", mailError);
            }
            return {
                success: true,
                message: "Inscription réussie! Les équipes ont été notifiées.",
                data: {
                    user: {
                        id: savedUser.id,
                        name: savedUser.name,
                        email: savedUser.email,
                    },
                    stagiaire: { id: savedStagiaire.id },
                },
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async generateLink(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["stagiaire"],
        });
        if (!user)
            throw new common_1.NotFoundException("Utilisateur non trouvé");
        const token = crypto.randomBytes(20).toString("hex");
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        const parrainageToken = this.parrainageTokenRepository.create({
            token,
            user_id: userId,
            parrain_data: JSON.stringify({
                user: { id: user.id, name: user.name, image: user.image },
                stagiaire: user.stagiaire ? { prenom: user.stagiaire.prenom } : null,
            }),
            expires_at: expiresAt,
        });
        await this.parrainageTokenRepository.save(parrainageToken);
        return { success: true, token };
    }
    async getParrainData(token) {
        const parrainageToken = await this.parrainageTokenRepository.findOne({
            where: {
                token,
                expires_at: (0, typeorm_2.MoreThan)(new Date()),
            },
        });
        if (!parrainageToken) {
            throw new common_1.NotFoundException("Lien de parrainage invalide ou expiré");
        }
        return {
            success: true,
            parrain: JSON.parse(parrainageToken.parrain_data),
        };
    }
    async getStatsParrain(userId) {
        const parrainages = await this.parrainageRepository.find({
            where: { parrain_id: userId },
        });
        const nombreFilleuls = parrainages.length;
        const totalPoints = parrainages.reduce((sum, p) => sum + (p.points || 0), 0);
        const gains = parrainages.reduce((sum, p) => sum + (Number(p.gains) || 0), 0);
        return {
            success: true,
            parrain_id: userId,
            nombre_filleuls: nombreFilleuls,
            total_points: totalPoints,
            gains: gains,
        };
    }
    async getEvents() {
        const events = await this.parrainageEventRepository.find({
            order: { date_debut: "ASC" },
        });
        return {
            success: true,
            data: events,
        };
    }
    async getFilleuls(parrainId) {
        const parrainages = await this.parrainageRepository.find({
            where: { parrain_id: parrainId },
            relations: ["filleul", "filleul.stagiaire"],
        });
        return {
            success: true,
            data: parrainages.map((p) => ({
                id: p.filleul_id,
                name: p.filleul?.name,
                date: p.date_parrainage,
                points: p.points,
                status: p.filleul?.stagiaire?.statut || "en_attente",
            })),
        };
    }
    async getRewards(parrainId) {
        const parrainages = await this.parrainageRepository.find({
            where: { parrain_id: parrainId },
        });
        const totalPoints = parrainages.reduce((sum, p) => sum + (p.points || 0), 0);
        const gains = parrainages.reduce((sum, p) => sum + (Number(p.gains) || 0), 0);
        return {
            success: true,
            total_points: totalPoints,
            total_filleuls: parrainages.length,
            gains: gains,
            rewards: parrainages.map((p) => ({
                id: p.id,
                points: p.points,
                date: p.date_parrainage,
            })),
        };
    }
    async getHistory(parrainId) {
        const parrainages = await this.parrainageRepository.find({
            where: { parrain_id: parrainId },
            relations: ["filleul", "filleul.stagiaire"],
            order: { date_parrainage: "DESC" },
        });
        const tokens = await this.parrainageTokenRepository.find({
            where: { user_id: parrainId },
            order: { created_at: "DESC" },
        });
        return {
            success: true,
            parrainages: parrainages.map((p) => ({
                id: p.id,
                parrain_id: p.parrain_id,
                filleul_id: p.filleul_id,
                points: p.points,
                gains: p.gains,
                created_at: p.date_parrainage || p.created_at,
                filleul: p.filleul
                    ? {
                        id: p.filleul.id,
                        name: p.filleul.name,
                        statut: p.filleul.stagiaire?.statut,
                    }
                    : null,
            })),
            tokens: tokens.map((t) => ({
                id: t.id,
                token: t.token,
                created_at: t.created_at,
                expires_at: t.expires_at,
            })),
        };
    }
};
exports.ParrainageService = ParrainageService;
exports.ParrainageService = ParrainageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(parrainage_entity_1.Parrainage)),
    __param(1, (0, typeorm_1.InjectRepository)(parrainage_token_entity_1.ParrainageToken)),
    __param(2, (0, typeorm_1.InjectRepository)(parrainage_event_entity_1.ParrainageEvent)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(5, (0, typeorm_1.InjectRepository)(demande_inscription_entity_1.DemandeInscription)),
    __param(6, (0, typeorm_1.InjectRepository)(catalogue_formation_entity_1.CatalogueFormation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        mail_service_1.MailService])
], ParrainageService);
//# sourceMappingURL=parrainage.service.js.map