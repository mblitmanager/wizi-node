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
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const classement_entity_1 = require("../entities/classement.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
const progression_entity_1 = require("../entities/progression.entity");
const quiz_entity_1 = require("../entities/quiz.entity");
const user_entity_1 = require("../entities/user.entity");
let RankingService = class RankingService {
    constructor(classementRepository, stagiaireRepository, participationRepository, progressionRepository, quizRepository, userRepository) {
        this.classementRepository = classementRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.participationRepository = participationRepository;
        this.progressionRepository = progressionRepository;
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
    }
    async getGlobalRanking() {
        const allClassements = await this.classementRepository.find({
            relations: ["stagiaire", "stagiaire.user", "quiz"],
        });
        const groupedByStagiaire = this.groupBy(allClassements, "stagiaire_id");
        const ranking = Object.keys(groupedByStagiaire).map((stagiaireId) => {
            const group = groupedByStagiaire[stagiaireId];
            const totalPoints = group.reduce((sum, item) => sum + (item.points || 0), 0);
            const first = group[0];
            const stagiaire = first.stagiaire;
            return {
                stagiaire: {
                    id: stagiaire.id.toString(),
                    prenom: stagiaire.prenom,
                    image: stagiaire.user?.image || null,
                },
                totalPoints,
                quizCount: group.length,
                averageScore: totalPoints / group.length,
            };
        });
        ranking.sort((a, b) => b.totalPoints - a.totalPoints);
        return ranking.map((item, index) => ({
            ...item,
            rang: index + 1,
            level: this.calculateLevel(item.totalPoints),
        }));
    }
    async getMyRanking(userId) {
        const globalRanking = await this.getGlobalRanking();
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException("Stagiaire not found");
        }
        const myRanking = globalRanking.find((item) => item.stagiaire.id === stagiaire.id.toString());
        if (!myRanking) {
            return {
                stagiaire: {
                    id: stagiaire.id.toString(),
                    prenom: stagiaire.prenom,
                    image: null,
                },
                totalPoints: 0,
                quizCount: 0,
                averageScore: 0,
                rang: globalRanking.length + 1,
                level: "1",
            };
        }
        return myRanking;
    }
    async getFormationRanking(formationId) {
        const progressions = await this.progressionRepository.find({
            where: { formation_id: formationId },
            relations: ["stagiaire", "stagiaire.user"],
            order: { score: "DESC" },
        });
        return progressions.map((p, index) => ({
            id: p.stagiaire.user_id,
            name: p.stagiaire.user?.name || "",
            points: p.score,
            rang: index + 1,
        }));
    }
    async getStagiaireProgress(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: [
                "stagiaire",
                "stagiaire.formateur",
                "stagiaire.formateur.user",
                "stagiaire.commercial",
                "stagiaire.stagiaire_catalogue_formations",
                "stagiaire.stagiaire_catalogue_formations.catalogue_formation",
            ],
        });
        if (!user || !user.stagiaire) {
            throw new common_1.NotFoundException("Stagiaire not found");
        }
        const stagiaireId = user.stagiaire.id;
        const participations = await this.participationRepository.find({
            where: { user_id: userId },
        });
        const totalQuizzes = participations.length;
        const completedQuizzes = participations.filter((p) => p.status === "completed").length;
        const totalPoints = participations.reduce((sum, p) => sum + (p.score || 0), 0);
        const totalTimeSpent = participations.reduce((sum, p) => sum + (p.time_spent || 0), 0);
        const globalRanking = await this.getGlobalRanking();
        const myRanking = globalRanking.find((item) => item.stagiaire.id === stagiaireId.toString());
        return {
            stagiaire: {
                id: stagiaireId.toString(),
                prenom: user.stagiaire.prenom,
                image: user.image || null,
            },
            totalPoints: myRanking?.totalPoints || 0,
            quizCount: completedQuizzes,
            averageScore: myRanking?.averageScore || 0,
            completedQuizzes: myRanking?.quizCount || 0,
            totalTimeSpent: totalTimeSpent,
            rang: myRanking?.rang || globalRanking.length + 1,
            level: parseInt(myRanking?.level || "1"),
        };
    }
    async getStagiaireRewards(stagiaireId) {
        const progression = await this.progressionRepository.findOne({
            where: { stagiaire_id: stagiaireId },
        });
        const completedQuizzes = await this.participationRepository.count({
            where: { user_id: stagiaireId, status: "completed" },
        });
        return {
            points: progression?.score || 0,
            completed_quizzes: completedQuizzes,
            completed_challenges: 0,
        };
    }
    async getStagiaireDetails(stagiaireId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id: stagiaireId },
            relations: [
                "user",
                "formateurs",
                "formateurs.user",
                "stagiaire_catalogue_formations",
                "stagiaire_catalogue_formations.catalogue_formation",
                "classements",
                "classements.quiz",
            ],
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException("Stagiaire not found");
        }
        const totalPoints = stagiaire.classements.reduce((sum, c) => sum + (c.points || 0), 0);
        const globalRanking = await this.getGlobalRanking();
        const myRanking = globalRanking.find((item) => item.stagiaire.id === stagiaireId.toString());
        const successPercentage = stagiaire.classements.length > 0
            ? (stagiaire.classements.filter((c) => (c.points || 0) > 0).length /
                stagiaire.classements.length) *
                100
            : 0;
        return {
            id: stagiaire.id,
            firstname: stagiaire.prenom,
            name: stagiaire.user?.name || "",
            avatar: stagiaire.user?.image || null,
            rang: myRanking?.rang || 999,
            totalPoints: totalPoints,
            formations: (stagiaire.stagiaire_catalogue_formations || []).map((scf) => ({
                id: scf.catalogue_formation.id,
                titre: scf.catalogue_formation.titre,
            })),
            formateurs: (stagiaire.formateurs || []).map((f) => ({
                id: f.id,
                prenom: f.prenom,
                nom: f.user?.name || "",
                image: f.user?.image || null,
            })),
            quizStats: {
                totalCompleted: stagiaire.classements.length,
                totalQuiz: stagiaire.classements.length,
                pourcentageReussite: successPercentage,
                byLevel: {
                    debutant: { completed: 0, total: 0 },
                    intermediaire: { completed: 0, total: 0 },
                    expert: { completed: 0, total: 0 },
                },
                lastActivity: stagiaire.updated_at,
            },
        };
    }
    async getUserPoints(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
            relations: ["classements"],
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException("Stagiaire not found");
        }
        const totalPoints = stagiaire.classements.reduce((sum, c) => sum + (c.points || 0), 0);
        const accessibleLevels = ["debutant"];
        if (totalPoints >= 50)
            accessibleLevels.push("intermediaire");
        if (totalPoints >= 100)
            accessibleLevels.push("expert");
        return {
            totalPoints,
            accessibleLevels,
        };
    }
    calculateLevel(points) {
        const basePoints = 10;
        const maxLevel = 100;
        let level = "1";
        for (let l = 0; l <= maxLevel; l++) {
            const threshold = (l - 1) * basePoints;
            if (points >= threshold) {
                level = l.toString();
            }
            else {
                break;
            }
        }
        return level;
    }
    groupBy(array, key) {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(classement_entity_1.Classement)),
    __param(1, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(2, (0, typeorm_1.InjectRepository)(quiz_participation_entity_1.QuizParticipation)),
    __param(3, (0, typeorm_1.InjectRepository)(progression_entity_1.Progression)),
    __param(4, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RankingService);
//# sourceMappingURL=ranking.service.js.map