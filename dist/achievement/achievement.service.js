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
exports.AchievementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const achievement_entity_1 = require("../entities/achievement.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
let AchievementService = class AchievementService {
    constructor(achievementRepository, stagiaireRepository) {
        this.achievementRepository = achievementRepository;
        this.stagiaireRepository = stagiaireRepository;
    }
    async getAchievements(stagiaireId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id: stagiaireId },
            relations: ["achievements"],
        });
        return stagiaire?.achievements || [];
    }
    async getAllAchievements() {
        return this.achievementRepository.find({
            relations: ["quiz"],
        });
    }
    async unlockAchievementByCode(stagiaireId, code) {
        const achievement = await this.achievementRepository.findOne({
            where: { code },
        });
        if (!achievement)
            return [];
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id: stagiaireId },
            relations: ["achievements"],
        });
        if (!stagiaire)
            return [];
        const isAlreadyUnlocked = stagiaire.achievements.some((a) => a.id === achievement.id);
        if (!isAlreadyUnlocked) {
            stagiaire.achievements.push(achievement);
            await this.stagiaireRepository.save(stagiaire);
            return [achievement];
        }
        return [];
    }
    async checkAchievements(stagiaireId, quizId) {
        return [];
    }
};
exports.AchievementService = AchievementService;
exports.AchievementService = AchievementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(achievement_entity_1.Achievement)),
    __param(1, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AchievementService);
//# sourceMappingURL=achievement.service.js.map