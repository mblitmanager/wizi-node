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
const user_entity_1 = require("../entities/user.entity");
const crypto = require("crypto");
let ParrainageService = class ParrainageService {
    constructor(parrainageRepository, tokenRepository, userRepository) {
        this.parrainageRepository = parrainageRepository;
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
    }
    async generateLink(userId) {
        const token = crypto.randomBytes(20).toString("hex");
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["stagiaire"],
        });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        const parrainageToken = this.tokenRepository.create({
            token,
            user_id: userId,
            parrain_data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                stagiaire: user.stagiaire,
            },
            expires_at: expiresAt,
        });
        await this.tokenRepository.save(parrainageToken);
        return {
            success: true,
            token,
        };
    }
    async getParrainData(token) {
        const parrainageToken = await this.tokenRepository.findOne({
            where: { token },
        });
        if (!parrainageToken || parrainageToken.expires_at < new Date()) {
            return {
                success: false,
                message: "Lien de parrainage invalide ou expiré",
            };
        }
        return {
            success: true,
            parrain: parrainageToken.parrain_data,
        };
    }
    async getStatsParrain(userId) {
        const count = await this.parrainageRepository.count({
            where: { parrain_id: userId },
        });
        const sumPoints = await this.parrainageRepository
            .createQueryBuilder("p")
            .select("SUM(p.points)", "total")
            .where("p.parrain_id = :userId", { userId })
            .getRawOne();
        const sumGains = await this.parrainageRepository
            .createQueryBuilder("p")
            .select("SUM(p.gains)", "total")
            .where("p.parrain_id = :userId", { userId })
            .getRawOne();
        return {
            success: true,
            parrain_id: userId,
            nombre_filleuls: parseInt(count.toString()),
            total_points: parseInt(sumPoints?.total || 0),
            gains: parseFloat(sumGains?.total || 0),
        };
    }
};
exports.ParrainageService = ParrainageService;
exports.ParrainageService = ParrainageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(parrainage_entity_1.Parrainage)),
    __param(1, (0, typeorm_1.InjectRepository)(parrainage_token_entity_1.ParrainageToken)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ParrainageService);
//# sourceMappingURL=parrainage.service.js.map