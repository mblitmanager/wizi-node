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
exports.ChallengeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const challenge_entity_1 = require("../entities/challenge.entity");
const progression_entity_1 = require("../entities/progression.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
let ChallengeService = class ChallengeService {
    constructor(challengeRepository, progressionRepository, stagiaireRepository, participationRepository) {
        this.challengeRepository = challengeRepository;
        this.progressionRepository = progressionRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.participationRepository = participationRepository;
    }
    async getChallengeConfig() {
        const activeChallenge = await this.challengeRepository.find({
            order: { created_at: "DESC" },
            take: 1,
        });
        return {
            active_challenge: activeChallenge[0] || null,
            config: {
                points_multiplier: 1.5,
                bonus_completion: 50,
            },
        };
    }
    async getLeaderboard() {
        const rankings = await this.progressionRepository
            .createQueryBuilder("progression")
            .innerJoinAndSelect("progression.stagiaire", "stagiaire")
            .orderBy("progression.completed_challenges", "DESC")
            .addOrderBy("progression.points", "DESC")
            .limit(20)
            .getMany();
        return rankings.map((r, index) => ({
            rank: index + 1,
            stagiaire_id: r.stagiaire_id,
            name: r.stagiaire.prenom,
            points: r.points,
            completed_challenges: r.completed_challenges,
        }));
    }
    async getChallengeEntries(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
        });
        if (!stagiaire)
            return [];
        const challenges = await this.challengeRepository.find({
            where: { participation_id: userId },
        });
        return challenges;
    }
};
exports.ChallengeService = ChallengeService;
exports.ChallengeService = ChallengeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(challenge_entity_1.Challenge)),
    __param(1, (0, typeorm_1.InjectRepository)(progression_entity_1.Progression)),
    __param(2, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(3, (0, typeorm_1.InjectRepository)(quiz_participation_entity_1.QuizParticipation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChallengeService);
//# sourceMappingURL=challenge.service.js.map