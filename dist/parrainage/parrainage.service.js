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
const crypto = require("crypto");
let ParrainageService = class ParrainageService {
    constructor(parrainageRepository, parrainageTokenRepository, parrainageEventRepository, userRepository, dataSource) {
        this.parrainageRepository = parrainageRepository;
        this.parrainageTokenRepository = parrainageTokenRepository;
        this.parrainageEventRepository = parrainageEventRepository;
        this.userRepository = userRepository;
        this.dataSource = dataSource;
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
};
exports.ParrainageService = ParrainageService;
exports.ParrainageService = ParrainageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(parrainage_entity_1.Parrainage)),
    __param(1, (0, typeorm_1.InjectRepository)(parrainage_token_entity_1.ParrainageToken)),
    __param(2, (0, typeorm_1.InjectRepository)(parrainage_event_entity_1.ParrainageEvent)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ParrainageService);
//# sourceMappingURL=parrainage.service.js.map