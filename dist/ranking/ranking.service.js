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
    async getGlobalRanking(period = "all") {
        let query = this.classementRepository
            .createQueryBuilder("c")
            .leftJoinAndSelect("c.stagiaire", "stagiaire")
            .leftJoinAndSelect("stagiaire.user", "user")
            .leftJoinAndSelect("stagiaire.formateurs", "formateurs")
            .leftJoinAndSelect("formateurs.user", "formateurUser")
            .leftJoinAndSelect("stagiaire.stagiaire_catalogue_formations", "scf")
            .leftJoinAndSelect("scf.catalogue_formation", "catalogueFormation")
            .leftJoinAndSelect("catalogueFormation.formation", "formation")
            .leftJoinAndSelect("c.quiz", "quiz");
        if (period === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            query = query.where("c.updated_at >= :weekAgo", { weekAgo });
        }
        else if (period === "month") {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            query = query.where("c.updated_at >= :monthAgo", { monthAgo });
        }
        const allClassements = await query.getMany();
        const groupedByStagiaire = {};
        allClassements.forEach((classement) => {
            const stagiaireId = classement.stagiaire_id;
            if (!groupedByStagiaire[stagiaireId]) {
                groupedByStagiaire[stagiaireId] = [];
            }
            groupedByStagiaire[stagiaireId].push(classement);
        });
        const ranking = Object.keys(groupedByStagiaire)
            .map((stagiaireId) => {
            const group = groupedByStagiaire[stagiaireId];
            const totalPoints = group.reduce((sum, item) => sum + (item.points || 0), 0);
            const quizCount = group.length;
            const averageScore = quizCount > 0 ? totalPoints / quizCount : 0;
            const first = group[0];
            const stagiaire = first.stagiaire;
            const formateurs = stagiaire.formateurs
                ? stagiaire.formateurs.map((formateur) => {
                    const formationsAssignees = stagiaire.stagiaire_catalogue_formations
                        ?.filter((scf) => scf.formateur_id === formateur.id)
                        ?.map((scf) => ({
                        id: scf.catalogue_formation?.id,
                        titre: scf.catalogue_formation?.titre,
                        description: scf.catalogue_formation?.description,
                        duree: scf.catalogue_formation?.duree,
                        tarif: scf.catalogue_formation?.tarif,
                        statut: scf.catalogue_formation?.statut,
                        image_url: scf.catalogue_formation?.image_url,
                        formation: scf.catalogue_formation?.formation
                            ? {
                                id: scf.catalogue_formation.formation.id,
                                titre: scf.catalogue_formation.formation.titre,
                                categorie: scf.catalogue_formation.formation.categorie,
                                icon: scf.catalogue_formation.formation.icon,
                            }
                            : null,
                    })) || [];
                    return {
                        id: formateur.id,
                        civilite: formateur.civilite,
                        prenom: formateur.prenom,
                        nom: formateur.user?.name,
                        telephone: formateur.telephone,
                        image: formateur.user?.image || null,
                        formations: formationsAssignees,
                    };
                })
                : [];
            const filteredFormateurs = formateurs.filter((f) => f.formations && f.formations.length > 0);
            return {
                stagiaire: {
                    id: stagiaire.id.toString(),
                    prenom: stagiaire.prenom,
                    nom: stagiaire.user?.name || "",
                    image: stagiaire.user?.image || null,
                },
                formateurs: filteredFormateurs,
                totalPoints,
                quizCount,
                averageScore: Math.round(averageScore * 100) / 100,
            };
        })
            .sort((a, b) => b.totalPoints - a.totalPoints);
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
        const quizStats = await this.getQuizStats(userId);
        return {
            stagiaire: {
                id: stagiaireId.toString(),
                prenom: user.stagiaire.prenom,
                image: user.image || null,
            },
            totalPoints: myRanking?.totalPoints || 0,
            quizCount: quizStats.totalQuizzes,
            averageScore: quizStats.averageScore,
            completedQuizzes: quizStats.totalQuizzes,
            totalTimeSpent: totalTimeSpent,
            rang: myRanking?.rang || globalRanking.length + 1,
            level: parseInt(myRanking?.level || "1"),
            categoryStats: quizStats.categoryStats,
            levelProgress: quizStats.levelProgress,
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
        const quizStats = await this.getQuizStats(stagiaire.user_id);
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
                byLevel: quizStats.levelProgress,
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
    async getQuizHistory(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
        });
        if (!stagiaire)
            return [];
        const progressions = await this.progressionRepository.find({
            where: { stagiaire_id: stagiaire.id },
            relations: ["quiz", "quiz.formation"],
            order: { created_at: "DESC" },
        });
        return progressions
            .filter((p) => p.quiz)
            .map((progression) => {
            const quiz = progression.quiz;
            const niveau = quiz.niveau || "débutant";
            const totalQuestions = progression.total_questions ||
                parseInt(quiz.nb_points_total || "0") ||
                0;
            const quizData = {
                id: quiz.id,
                titre: quiz.titre,
                description: quiz.description
                    ? quiz.description.substring(0, 100)
                    : "",
                duree: quiz.duree,
                niveau: quiz.niveau,
                status: quiz.status,
                nb_points_total: quiz.nb_points_total,
                formation: quiz.formation
                    ? {
                        id: quiz.formation.id,
                        titre: quiz.formation.titre,
                        categorie: quiz.formation.categorie,
                    }
                    : null,
                questions: [],
            };
            return {
                id: progression.id.toString(),
                quiz: quizData,
                score: progression.score,
                completedAt: progression.created_at?.toISOString(),
                timeSpent: progression.time_spent || 0,
                totalQuestions: totalQuestions,
                correctAnswers: progression.correct_answers || 0,
            };
        });
    }
    async getQuizStats(userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
        });
        if (!stagiaire) {
            return {
                totalQuizzes: 0,
                averageScore: 0,
                totalPoints: 0,
                categoryStats: [],
                levelProgress: {
                    débutant: { completed: 0, averageScore: null },
                    intermédiaire: { completed: 0, averageScore: null },
                    avancé: { completed: 0, averageScore: null },
                },
            };
        }
        const classements = await this.classementRepository.find({
            where: { stagiaire_id: stagiaire.id },
            relations: ["quiz", "quiz.formation"],
        });
        const totalQuizzes = classements.length;
        const totalPoints = classements.reduce((sum, c) => sum + (c.points || 0), 0);
        const averageScore = totalQuizzes > 0 ? totalPoints / totalQuizzes : 0;
        const categoryMap = {};
        const levelProgress = {
            débutant: { completed: 0, totalScore: 0 },
            intermédiaire: { completed: 0, totalScore: 0 },
            avancé: { completed: 0, totalScore: 0 },
        };
        classements.forEach((c) => {
            const score = c.points || 0;
            const category = c.quiz?.formation?.categorie || "Général";
            if (!categoryMap[category]) {
                categoryMap[category] = { count: 0, totalScore: 0 };
            }
            categoryMap[category].count++;
            categoryMap[category].totalScore += score;
            const level = c.quiz?.niveau?.toLowerCase() || "débutant";
            if (level.includes("débutant") || level.includes("debutant")) {
                levelProgress.débutant.completed++;
                levelProgress.débutant.totalScore += score;
            }
            else if (level.includes("intermédiaire") ||
                level.includes("intermediaire")) {
                levelProgress.intermédiaire.completed++;
                levelProgress.intermédiaire.totalScore += score;
            }
            else if (level.includes("expert") || level.includes("avancé")) {
                levelProgress.avancé.completed++;
                levelProgress.avancé.totalScore += score;
            }
        });
        const categoryStats = Object.keys(categoryMap).map((cat) => ({
            category: cat,
            quizCount: categoryMap[cat].count,
            averageScore: Math.round((categoryMap[cat].totalScore / categoryMap[cat].count) * 100) / 100,
        }));
        return {
            totalQuizzes,
            averageScore: Math.round(averageScore * 100) / 100,
            totalPoints,
            categoryStats,
            levelProgress: {
                débutant: {
                    completed: levelProgress.débutant.completed,
                    averageScore: levelProgress.débutant.completed > 0
                        ? Math.round((levelProgress.débutant.totalScore /
                            levelProgress.débutant.completed) *
                            100) / 100
                        : null,
                },
                intermédiaire: {
                    completed: levelProgress.intermédiaire.completed,
                    averageScore: levelProgress.intermédiaire.completed > 0
                        ? Math.round((levelProgress.intermédiaire.totalScore /
                            levelProgress.intermédiaire.completed) *
                            100) / 100
                        : null,
                },
                avancé: {
                    completed: levelProgress.avancé.completed,
                    averageScore: levelProgress.avancé.completed > 0
                        ? Math.round((levelProgress.avancé.totalScore /
                            levelProgress.avancé.completed) *
                            100) / 100
                        : null,
                },
            },
        };
    }
    async getCategoryStats(userId) {
        const stats = await this.getQuizStats(userId);
        return (stats.categoryStats || []).map((cat) => ({
            ...cat,
            completedQuizzes: cat.quizCount,
            totalQuizzes: cat.quizCount,
            completionRate: 100,
        }));
    }
    async getProgressStats(userId) {
        const participations = await this.participationRepository.find({
            where: { user_id: userId, status: "completed" },
            order: { completed_at: "ASC" },
        });
        const daily = participations.reduce((acc, p) => {
            const date = p.completed_at?.toISOString().split("T")[0];
            if (!date)
                return acc;
            if (!acc[date])
                acc[date] = { date, completed_quizzes: 0, total_points: 0 };
            acc[date].completed_quizzes++;
            acc[date].total_points += p.score || 0;
            return acc;
        }, {});
        return {
            daily_progress: Object.values(daily).map((d) => ({
                ...d,
                average_points: d.total_points / d.completed_quizzes,
            })),
            weekly_progress: [],
            monthly_progress: [],
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