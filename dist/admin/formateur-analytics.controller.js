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
exports.FormateurAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const api_response_service_1 = require("../common/services/api-response.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const formateur_entity_1 = require("../entities/formateur.entity");
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
const admin_service_1 = require("./admin.service");
let FormateurAnalyticsController = class FormateurAnalyticsController {
    constructor(formateurRepository, quizParticipationRepository, adminService, apiResponse) {
        this.formateurRepository = formateurRepository;
        this.quizParticipationRepository = quizParticipationRepository;
        this.adminService = adminService;
        this.apiResponse = apiResponse;
    }
    async getFormationsPerformance(req) {
        const data = await this.adminService.getFormateurFormations(req.user.id);
        return this.apiResponse.success(data);
    }
    async getStagiaireFormations(id) {
        const data = await this.adminService.getStagiaireFormationPerformance(id);
        return this.apiResponse.success(data);
    }
    async getQuizSuccessRate(period = 30, req) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
            relations: ["stagiaires"],
        });
        const stagiaireIds = formateur.stagiaires.map((s) => s.id);
        const participations = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .leftJoinAndSelect("qp.quiz", "quiz")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .andWhere("qp.status = :status", { status: "completed" })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
            days: period,
        })
            .getMany();
        const quizStatsMap = new Map();
        participations.forEach((p) => {
            if (!quizStatsMap.has(p.quiz_id)) {
                quizStatsMap.set(p.quiz_id, {
                    quiz_id: p.quiz_id,
                    quiz_name: p.quiz.titre,
                    category: p.quiz.categorie || "Général",
                    participations: [],
                });
            }
            quizStatsMap.get(p.quiz_id).participations.push(p);
        });
        const quizStats = Array.from(quizStatsMap.values()).map((stat) => {
            const total = stat.participations.length;
            const successful = stat.participations.filter((p) => {
                const maxScore = p.quiz.nb_points_total || 100;
                return p.score / maxScore >= 0.5;
            }).length;
            const avgScore = stat.participations.reduce((sum, p) => sum + p.score, 0) /
                total;
            return {
                quiz_id: stat.quiz_id,
                quiz_name: stat.quiz_name,
                category: stat.category,
                total_attempts: total,
                successful_attempts: successful,
                success_rate: Math.round((successful / total) * 1000) / 10,
                average_score: Math.round(avgScore * 10) / 10,
            };
        });
        return this.apiResponse.success({
            period_days: period,
            quiz_stats: quizStats,
        });
    }
    async getCompletionTime(period = 30, req) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
            relations: ["stagiaires"],
        });
        const stagiaireIds = formateur.stagiaires.map((s) => s.id);
        const trends = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .select("DATE(qp.created_at)", "date")
            .addSelect("AVG(qp.time_spent)", "avg_time")
            .addSelect("COUNT(*)", "count")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .andWhere("qp.status = :status", { status: "completed" })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
            days: period,
        })
            .groupBy("DATE(qp.created_at)")
            .orderBy("date", "ASC")
            .getRawMany();
        const completionTrends = trends.map((t) => ({
            date: t.date,
            avg_time_minutes: Math.round((t.avg_time / 60) * 10) / 10,
            quiz_count: parseInt(t.count),
        }));
        const quizTimes = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .leftJoinAndSelect("qp.quiz", "quiz")
            .select("qp.quiz_id", "quiz_id")
            .addSelect("quiz.titre", "quiz_name")
            .addSelect("quiz.categorie", "category")
            .addSelect("AVG(qp.time_spent)", "avg_time")
            .addSelect("COUNT(*)", "attempts")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .andWhere("qp.status = :status", { status: "completed" })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
            days: period,
        })
            .groupBy("qp.quiz_id")
            .getRawMany();
        const quizAvgTimes = quizTimes.map((qt) => ({
            quiz_name: qt.quiz_name,
            category: qt.category || "Général",
            avg_time_minutes: Math.round((qt.avg_time / 60) * 10) / 10,
            attempts: parseInt(qt.attempts),
        }));
        return this.apiResponse.success({
            period_days: period,
            completion_trends: completionTrends,
            quiz_avg_times: quizAvgTimes,
        });
    }
    async getActivityHeatmap(period = 30, req) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
            relations: ["stagiaires"],
        });
        const stagiaireIds = formateur.stagiaires.map((s) => s.id);
        const byDay = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .select("DAYOFWEEK(qp.created_at)", "day_of_week")
            .addSelect("COUNT(*)", "activity_count")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
            days: period,
        })
            .groupBy("day_of_week")
            .orderBy("day_of_week", "ASC")
            .getRawMany();
        const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
        const activityByDay = byDay.map((bd) => ({
            day: days[bd.day_of_week - 1] || "Unknown",
            activity_count: parseInt(bd.activity_count),
        }));
        const byHour = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .select("HOUR(qp.created_at)", "hour")
            .addSelect("COUNT(*)", "activity_count")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
            days: period,
        })
            .groupBy("hour")
            .orderBy("hour", "ASC")
            .getRawMany();
        const activityByHour = byHour.map((bh) => ({
            hour: parseInt(bh.hour),
            activity_count: parseInt(bh.activity_count),
        }));
        return this.apiResponse.success({
            period_days: period,
            activity_by_day: activityByDay,
            activity_by_hour: activityByHour,
        });
    }
    async getDropoutRate(req) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
            relations: ["stagiaires"],
        });
        const stagiaireIds = formateur.stagiaires.map((s) => s.id);
        const quizDropout = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .leftJoinAndSelect("qp.quiz", "quiz")
            .select("qp.quiz_id", "quiz_id")
            .addSelect("quiz.titre", "quiz_name")
            .addSelect("quiz.categorie", "category")
            .addSelect("COUNT(*)", "total_attempts")
            .addSelect('SUM(CASE WHEN qp.status = "completed" THEN 1 ELSE 0 END)', "completed")
            .addSelect('SUM(CASE WHEN qp.status != "completed" THEN 1 ELSE 0 END)', "abandoned")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .groupBy("qp.quiz_id")
            .getRawMany();
        const dropoutStats = quizDropout
            .map((qd) => {
            const total = parseInt(qd.total_attempts);
            const completed = parseInt(qd.completed);
            const abandoned = parseInt(qd.abandoned);
            const dropoutRate = total > 0 ? Math.round((abandoned / total) * 1000) / 10 : 0;
            return {
                quiz_name: qd.quiz_name || "Unknown",
                category: qd.category || "Général",
                total_attempts: total,
                completed,
                abandoned,
                dropout_rate: dropoutRate,
            };
        })
            .sort((a, b) => b.dropout_rate - a.dropout_rate);
        const totalAttempts = dropoutStats.reduce((sum, d) => sum + d.total_attempts, 0);
        const totalCompleted = dropoutStats.reduce((sum, d) => sum + d.completed, 0);
        const totalAbandoned = dropoutStats.reduce((sum, d) => sum + d.abandoned, 0);
        return this.apiResponse.success({
            overall: {
                total_attempts: totalAttempts,
                completed: totalCompleted,
                abandoned: totalAbandoned,
                dropout_rate: totalAttempts > 0
                    ? Math.round((totalAbandoned / totalAttempts) * 1000) / 10
                    : 0,
            },
            quiz_dropout: dropoutStats,
        });
    }
    async getDashboard(period = 30, req) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
            relations: ["stagiaires"],
        });
        const stagiaireIds = formateur.stagiaires.map((s) => s.id);
        const totalStagiaires = stagiaireIds.length;
        const activeStagiaires = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .select("DISTINCT qp.stagiaire_id")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")
            .getRawMany();
        const totalCompletions = await this.quizParticipationRepository.count({
            where: {
                stagiaire_id: stagiaireIds,
                status: "completed",
            },
        });
        const avgScoreResult = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .select("AVG(qp.score)", "avg_score")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .andWhere("qp.status = :status", { status: "completed" })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
            days: period,
        })
            .getRawOne();
        const previousCompletions = await this.quizParticipationRepository.count({
            where: {
                stagiaire_id: stagiaireIds,
                status: "completed",
            },
        });
        const trend = previousCompletions > 0
            ? Math.round(((totalCompletions - previousCompletions) / previousCompletions) *
                1000) / 10
            : 0;
        return this.apiResponse.success({
            period_days: period,
            summary: {
                total_stagiaires: totalStagiaires,
                active_stagiaires: activeStagiaires.length,
                total_completions: totalCompletions,
                average_score: Math.round((avgScoreResult?.avg_score || 0) * 10) / 10,
                trend_percentage: trend,
            },
        });
    }
    async getStudentPerformance(req) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
            relations: ["stagiaires", "stagiaires.user"],
        });
        if (!formateur) {
            return this.apiResponse.success({
                performance: [],
                rankings: {
                    most_quizzes: [],
                    most_active: [],
                },
            });
        }
        const userIds = formateur.stagiaires
            ? formateur.stagiaires
                .map((s) => s.user_id)
                .filter((id) => id != null)
            : [];
        if (userIds.length === 0) {
            return this.apiResponse.success({
                performance: [],
                rankings: {
                    most_quizzes: [],
                    most_active: [],
                },
            });
        }
        const quizStats = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .select("qp.user_id", "user_id")
            .addSelect("COUNT(DISTINCT qp.quiz_id)", "total_quizzes")
            .addSelect("MAX(qp.created_at)", "last_quiz_at")
            .where("qp.user_id IN (:...ids)", { ids: userIds })
            .andWhere("qp.status = :status", { status: "completed" })
            .groupBy("qp.user_id")
            .getRawMany();
        const statsMap = new Map();
        quizStats.forEach((stat) => {
            statsMap.set(parseInt(stat.user_id), {
                total_quizzes: parseInt(stat.total_quizzes),
                last_quiz_at: stat.last_quiz_at,
            });
        });
        const performanceData = formateur.stagiaires.map((stagiaire) => {
            const stats = statsMap.get(stagiaire.user_id) || {
                total_quizzes: 0,
                last_quiz_at: null,
            };
            return {
                id: stagiaire.id,
                name: stagiaire.user?.name || stagiaire.prenom || "Apprenant",
                email: stagiaire.user?.email,
                image: stagiaire.user?.image,
                last_quiz_at: stats.last_quiz_at,
                total_quizzes: stats.total_quizzes,
                total_logins: stagiaire.login_streak || 0,
            };
        });
        const mostQuizzes = [...performanceData]
            .sort((a, b) => b.total_quizzes - a.total_quizzes)
            .slice(0, 5);
        const mostActive = [...performanceData]
            .sort((a, b) => b.total_logins - a.total_logins)
            .slice(0, 5);
        return this.apiResponse.success({
            performance: performanceData,
            rankings: {
                most_quizzes: mostQuizzes,
                most_active: mostActive,
            },
        });
    }
};
exports.FormateurAnalyticsController = FormateurAnalyticsController;
__decorate([
    (0, common_1.Get)("formations/performance"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurAnalyticsController.prototype, "getFormationsPerformance", null);
__decorate([
    (0, common_1.Get)("stagiaire/:id/formations"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurAnalyticsController.prototype, "getStagiaireFormations", null);
__decorate([
    (0, common_1.Get)("quiz-success-rate"),
    __param(0, (0, common_1.Query)("period")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurAnalyticsController.prototype, "getQuizSuccessRate", null);
__decorate([
    (0, common_1.Get)("completion-time"),
    __param(0, (0, common_1.Query)("period")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurAnalyticsController.prototype, "getCompletionTime", null);
__decorate([
    (0, common_1.Get)("activity-heatmap"),
    __param(0, (0, common_1.Query)("period")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurAnalyticsController.prototype, "getActivityHeatmap", null);
__decorate([
    (0, common_1.Get)("dropout-rate"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurAnalyticsController.prototype, "getDropoutRate", null);
__decorate([
    (0, common_1.Get)("dashboard"),
    __param(0, (0, common_1.Query)("period")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurAnalyticsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)("performance"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurAnalyticsController.prototype, "getStudentPerformance", null);
exports.FormateurAnalyticsController = FormateurAnalyticsController = __decorate([
    (0, common_1.Controller)("formateur/analytics"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("formateur", "formatrice"),
    __param(0, (0, typeorm_1.InjectRepository)(formateur_entity_1.Formateur)),
    __param(1, (0, typeorm_1.InjectRepository)(quiz_participation_entity_1.QuizParticipation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        admin_service_1.AdminService,
        api_response_service_1.ApiResponseService])
], FormateurAnalyticsController);
//# sourceMappingURL=formateur-analytics.controller.js.map