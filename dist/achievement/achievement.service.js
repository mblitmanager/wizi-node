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
const stagiaire_achievement_entity_1 = require("../entities/stagiaire-achievement.entity");
const progression_entity_1 = require("../entities/progression.entity");
const quiz_entity_1 = require("../entities/quiz.entity");
const media_stagiaire_entity_1 = require("../entities/media-stagiaire.entity");
const media_entity_1 = require("../entities/media.entity");
const parrainage_entity_1 = require("../entities/parrainage.entity");
let AchievementService = class AchievementService {
    constructor(achievementRepository, stagiaireRepository, stagiaireAchievementRepository, progressionRepository, quizRepository, mediaStagiaireRepository, mediaRepository, parrainageRepository) {
        this.achievementRepository = achievementRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.stagiaireAchievementRepository = stagiaireAchievementRepository;
        this.progressionRepository = progressionRepository;
        this.quizRepository = quizRepository;
        this.mediaStagiaireRepository = mediaStagiaireRepository;
        this.mediaRepository = mediaRepository;
        this.parrainageRepository = parrainageRepository;
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
        const existing = await this.stagiaireAchievementRepository.findOne({
            where: { stagiaire_id: stagiaireId, achievement_id: achievement.id },
        });
        if (existing)
            return [];
        const newUnlock = this.stagiaireAchievementRepository.create({
            stagiaire_id: stagiaireId,
            achievement_id: achievement.id,
            unlocked_at: new Date(),
        });
        await this.stagiaireAchievementRepository.save(newUnlock);
        return [achievement];
    }
    async checkAchievements(stagiaireId, quizId) {
        const newAchievements = [];
        const now = new Date();
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id: stagiaireId },
            relations: ["achievements"],
        });
        if (!stagiaire)
            return [];
        let streak = stagiaire.login_streak || 0;
        const lastLogin = stagiaire.last_login_at;
        if (lastLogin) {
            if (this.isToday(lastLogin)) {
            }
            else if (this.isYesterday(lastLogin)) {
                streak++;
            }
            else {
                streak = 1;
            }
        }
        else {
            streak = 1;
        }
        stagiaire.login_streak = streak;
        stagiaire.last_login_at = now;
        await this.stagiaireRepository.save(stagiaire);
        const { totalPoints } = await this.progressionRepository
            .createQueryBuilder("progression")
            .select("SUM(progression.score)", "totalPoints")
            .where("progression.stagiaire_id = :id", { id: stagiaireId })
            .getRawOne();
        const currentPoints = parseInt(totalPoints || "0");
        const quizStats = await this.getQuizStats(stagiaireId);
        const videoStats = await this.getVideoStats(stagiaireId);
        const totalReferrals = await this.parrainageRepository.count({
            where: { parrain_id: stagiaire.user_id },
        });
        const achievements = await this.achievementRepository.find();
        const alreadyUnlockedIds = stagiaire.achievements.map((a) => a.id);
        for (const achievement of achievements) {
            let unlocked = false;
            const conditionValue = parseInt(achievement.condition || "0");
            switch (achievement.type) {
                case "connexion_serie":
                    if (streak >= conditionValue)
                        unlocked = true;
                    break;
                case "points":
                    if (currentPoints >= conditionValue)
                        unlocked = true;
                    break;
                case "quiz":
                    if (conditionValue == 1 && quizStats.total_quizzes >= 1)
                        unlocked = true;
                    break;
                case "quiz_level":
                    if (quizId && conditionValue == 1) {
                        const quiz = await this.quizRepository.findOne({
                            where: { id: quizId },
                        });
                        if (quiz && quiz.niveau === achievement.level)
                            unlocked = true;
                    }
                    break;
                case "quiz_all":
                    if (quizStats.total_quizzes >= quizStats.available_quizzes &&
                        quizStats.available_quizzes > 0)
                        unlocked = true;
                    break;
                case "quiz_all_level":
                    const levelMapping = {
                        débutant: "beginner",
                        intermédiaire: "intermediate",
                        avancé: "advanced",
                    };
                    const levelKey = levelMapping[achievement.level?.toLowerCase() || ""] ||
                        achievement.level;
                    if (quizStats.quizzes_by_level[levelKey] &&
                        quizStats.available_by_level[levelKey] &&
                        quizStats.quizzes_by_level[levelKey] >=
                            quizStats.available_by_level[levelKey]) {
                        unlocked = true;
                    }
                    break;
                case "video":
                    if (conditionValue == 1 && videoStats.total_videos >= 1)
                        unlocked = true;
                    else if (conditionValue == 0 &&
                        videoStats.total_videos >= videoStats.available_videos &&
                        videoStats.available_videos > 0)
                        unlocked = true;
                    break;
                case "parrainage":
                    if (totalReferrals >= conditionValue)
                        unlocked = true;
                    break;
                case "action":
                    break;
            }
            if (unlocked && !alreadyUnlockedIds.includes(achievement.id)) {
                const unlockRecord = this.stagiaireAchievementRepository.create({
                    stagiaire_id: stagiaireId,
                    achievement_id: achievement.id,
                    unlocked_at: now,
                });
                await this.stagiaireAchievementRepository.save(unlockRecord);
                newAchievements.push(achievement);
                alreadyUnlockedIds.push(achievement.id);
            }
        }
        return newAchievements;
    }
    isToday(date) {
        const today = new Date();
        return (date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear());
    }
    isYesterday(date) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return (date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear());
    }
    async getQuizStats(stagiaireId) {
        const progressions = await this.progressionRepository.find({
            where: { stagiaire_id: stagiaireId },
            relations: ["quiz"],
        });
        const totalQuizzes = progressions.length;
        const quizzesByLevel = {
            beginner: progressions.filter((p) => p.quiz?.niveau?.toLowerCase() === "débutant").length,
            intermediate: progressions.filter((p) => p.quiz?.niveau?.toLowerCase() === "intermédiaire").length,
            advanced: progressions.filter((p) => p.quiz?.niveau?.toLowerCase() === "avancé").length,
        };
        const availableQuizzes = await this.quizRepository.count();
        const availableByLevel = {
            beginner: await this.quizRepository.count({
                where: { niveau: "débutant" },
            }),
            intermediate: await this.quizRepository.count({
                where: { niveau: "intermédiaire" },
            }),
            advanced: await this.quizRepository.count({
                where: { niveau: "avancé" },
            }),
        };
        return {
            total_quizzes: totalQuizzes,
            quizzes_by_level: quizzesByLevel,
            available_quizzes: availableQuizzes,
            available_by_level: availableByLevel,
        };
    }
    async getVideoStats(stagiaireId) {
        const watchedVideos = await this.mediaStagiaireRepository.count({
            where: { stagiaire_id: stagiaireId, is_watched: true },
        });
        const availableVideos = await this.mediaRepository.count();
        return {
            total_videos: watchedVideos,
            available_videos: availableVideos,
        };
    }
};
exports.AchievementService = AchievementService;
exports.AchievementService = AchievementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(achievement_entity_1.Achievement)),
    __param(1, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(2, (0, typeorm_1.InjectRepository)(stagiaire_achievement_entity_1.StagiaireAchievement)),
    __param(3, (0, typeorm_1.InjectRepository)(progression_entity_1.Progression)),
    __param(4, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __param(5, (0, typeorm_1.InjectRepository)(media_stagiaire_entity_1.MediaStagiaire)),
    __param(6, (0, typeorm_1.InjectRepository)(media_entity_1.Media)),
    __param(7, (0, typeorm_1.InjectRepository)(parrainage_entity_1.Parrainage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AchievementService);
//# sourceMappingURL=achievement.service.js.map