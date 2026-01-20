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
exports.CommercialApiController = exports.FormateurApiController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const api_response_service_1 = require("../common/services/api-response.service");
const admin_service_1 = require("./admin.service");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const formateur_entity_1 = require("../entities/formateur.entity");
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
let FormateurApiController = class FormateurApiController {
    constructor(apiResponse, adminService, formateurRepository, quizParticipationRepository) {
        this.apiResponse = apiResponse;
        this.adminService = adminService;
        this.formateurRepository = formateurRepository;
        this.quizParticipationRepository = quizParticipationRepository;
    }
    async dashboardStats(req) {
        const stats = await this.adminService.getFormateurDashboardStats(req.user.id);
        return this.apiResponse.success(stats);
    }
    async formations(req) {
        const data = await this.adminService.getFormateurFormations(req.user.id);
        return this.apiResponse.success(data);
    }
    async stagiaires(req) {
        console.log("[DEBUG] Controller: GET /api/formateur/stagiaires hit");
        const data = await this.adminService.getFormateurStagiaires();
        console.log(`[DEBUG] Controller: Service returned ${data.length} stagiaires`);
        return this.apiResponse.success({ stagiaires: data });
    }
    async onlineStagiaires(req) {
        try {
            const data = await this.adminService.getFormateurOnlineStagiaires(req.user.id);
            return this.apiResponse.success({
                stagiaires: data,
                total: data.length,
            });
        }
        catch (error) {
            console.error('Error fetching online stagiaires:', error);
            return this.apiResponse.success({
                stagiaires: [],
                total: 0,
            });
        }
    }
    async inactiveStagiaires(req, days = 7, scope = "all") {
        const stats = await this.adminService.getFormateurInactiveStagiaires(req.user.id, days, scope);
        console.log("[DEBUG] Inactive Stagiaires Stats:", JSON.stringify(stats).substring(0, 500));
        return this.apiResponse.success(stats);
    }
    async neverConnected() {
        const data = await this.adminService.getNeverConnected();
        return this.apiResponse.success({ stagiaires: data });
    }
    async performance(req) {
        const stats = await this.adminService.getFormateurStagiairesPerformance(req.user.id);
        return this.apiResponse.success(stats);
    }
    async disconnect(data) {
        const updatedCount = await this.adminService.disconnectStagiaires(data.stagiaire_ids);
        return this.apiResponse.success({
            success: true,
            message: `${updatedCount} stagiaire(s) déconnecté(s)`,
            disconnected_count: updatedCount,
        });
    }
    async stagiaireStats(id) {
        const stats = await this.adminService.getStagiaireStats(id);
        if (!stats) {
            return this.apiResponse.error("Stagiaire non trouvé", 404);
        }
        return this.apiResponse.success(stats);
    }
    async videoStats(id) {
        return this.apiResponse.success({});
    }
    async videos() {
        return this.apiResponse.success([]);
    }
    async formationRanking(formationId) {
        return this.apiResponse.success([]);
    }
    async arenaRanking(period = "all", formationId) {
        const data = await this.adminService.getTrainerArenaRanking(period, formationId);
        return this.apiResponse.success(data);
    }
    async mesStagiairesRanking(req, period = "all") {
        const data = await this.adminService.getMyStagiairesRanking(req.user.id, period);
        return this.apiResponse.success(data);
    }
    async sendEmail(data) {
        return this.apiResponse.success();
    }
    async sendNotification(req, data) {
        const { recipient_ids, title, body } = data;
        const result = await this.adminService.sendNotification(req.user.id, recipient_ids, title, body);
        return this.apiResponse.success(result);
    }
    async trends(req) {
        const data = await this.adminService.getFormateurTrends(req.user.id);
        return this.apiResponse.success(data);
    }
    async getFormationsPerformance(req) {
        const data = await this.adminService.getFormateurFormations(req.user.id);
        return this.apiResponse.success(data);
    }
    async getStagiaireFormations(id) {
        const data = await this.adminService.getStagiaireFormationPerformance(id);
        return this.apiResponse.success(data);
    }
    async getQuizSuccessRate(period = 30, formationId, req) {
        const data = await this.adminService.getFormateurQuizSuccessRate(req.user.id, period, formationId);
        return this.apiResponse.success(data);
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
    async getActivityHeatmap(period = 30, formationId, req) {
        const data = await this.adminService.getFormateurActivityHeatmap(req.user.id, period, formationId);
        return this.apiResponse.success(data);
    }
    async getDropoutRate(formationId, req) {
        const data = await this.adminService.getFormateurDropoutRate(req.user.id, formationId);
        return this.apiResponse.success(data);
    }
    async getDashboard(period = 30, formationId, req) {
        const data = await this.adminService.getFormateurAnalyticsDashboard(req.user.id, period, formationId);
        return this.apiResponse.success(data);
    }
    async getFormationsOverview(req) {
        const data = await this.adminService.getFormateurFormationsPerformance(req.user.id);
        return this.apiResponse.success(data);
    }
    async getStudentsComparison(formationId, req) {
        const data = await this.adminService.getFormateurStudentsComparison(req.user.id, formationId);
        return this.apiResponse.success(data);
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
    async stats() {
        return this.apiResponse.success({});
    }
};
exports.FormateurApiController = FormateurApiController;
__decorate([
    (0, common_1.Get)("dashboard/stats"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "dashboardStats", null);
__decorate([
    (0, common_1.Get)("formations"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "formations", null);
__decorate([
    (0, common_1.Get)("stagiaires"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "stagiaires", null);
__decorate([
    (0, common_1.Get)("stagiaires/online"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "onlineStagiaires", null);
__decorate([
    (0, common_1.Get)("stagiaires/inactive"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("days")),
    __param(2, (0, common_1.Query)("scope")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "inactiveStagiaires", null);
__decorate([
    (0, common_1.Get)("stagiaires/never-connected"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "neverConnected", null);
__decorate([
    (0, common_1.Get)("stagiaires/performance"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "performance", null);
__decorate([
    (0, common_1.Post)("stagiaires/disconnect"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "disconnect", null);
__decorate([
    (0, common_1.Get)("stagiaire/:id/stats"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "stagiaireStats", null);
__decorate([
    (0, common_1.Get)("video/:id/stats"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "videoStats", null);
__decorate([
    (0, common_1.Get)("videos"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "videos", null);
__decorate([
    (0, common_1.Get)("classement/formation/:formationId"),
    __param(0, (0, common_1.Param)("formationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "formationRanking", null);
__decorate([
    (0, common_1.Get)("classement/arena"),
    __param(0, (0, common_1.Query)("period")),
    __param(1, (0, common_1.Query)("formation_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "arenaRanking", null);
__decorate([
    (0, common_1.Get)("classement/mes-stagiaires"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "mesStagiairesRanking", null);
__decorate([
    (0, common_1.Post)("send-email"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Post)("send-notification"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Get)("trends"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "trends", null);
__decorate([
    (0, common_1.Get)("analytics/formations/performance"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "getFormationsPerformance", null);
__decorate([
    (0, common_1.Get)("analytics/stagiaire/:id/formations"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "getStagiaireFormations", null);
__decorate([
    (0, common_1.Get)("analytics/quiz-success-rate"),
    __param(0, (0, common_1.Query)("period")),
    __param(1, (0, common_1.Query)("formation_id")),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "getQuizSuccessRate", null);
__decorate([
    (0, common_1.Get)("analytics/completion-time"),
    __param(0, (0, common_1.Query)("period")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "getCompletionTime", null);
__decorate([
    (0, common_1.Get)("analytics/activity-heatmap"),
    __param(0, (0, common_1.Query)("period")),
    __param(1, (0, common_1.Query)("formation_id")),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "getActivityHeatmap", null);
__decorate([
    (0, common_1.Get)("analytics/dropout-rate"),
    __param(0, (0, common_1.Query)("formation_id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "getDropoutRate", null);
__decorate([
    (0, common_1.Get)("analytics/dashboard"),
    __param(0, (0, common_1.Query)("period")),
    __param(1, (0, common_1.Query)("formation_id")),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)("analytics/formations-performance"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "getFormationsOverview", null);
__decorate([
    (0, common_1.Get)("analytics/students-comparison"),
    __param(0, (0, common_1.Query)("formation_id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "getStudentsComparison", null);
__decorate([
    (0, common_1.Get)("analytics/performance"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "getStudentPerformance", null);
__decorate([
    (0, common_1.Get)("stats/dashboard"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "stats", null);
exports.FormateurApiController = FormateurApiController = __decorate([
    (0, common_1.Controller)("formateur"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("formateur", "formatrice"),
    __param(2, (0, typeorm_1.InjectRepository)(formateur_entity_1.Formateur)),
    __param(3, (0, typeorm_1.InjectRepository)(quiz_participation_entity_1.QuizParticipation)),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService,
        admin_service_1.AdminService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FormateurApiController);
let CommercialApiController = class CommercialApiController {
    constructor(apiResponse, adminService) {
        this.apiResponse = apiResponse;
        this.adminService = adminService;
    }
    async dashboard(req) {
        const data = await this.adminService.getCommercialDashboardStats();
        return this.apiResponse.success(data);
    }
};
exports.CommercialApiController = CommercialApiController;
__decorate([
    (0, common_1.Get)("dashboard"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommercialApiController.prototype, "dashboard", null);
exports.CommercialApiController = CommercialApiController = __decorate([
    (0, common_1.Controller)("commercial/stats"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("commercial", "commerciale"),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService,
        admin_service_1.AdminService])
], CommercialApiController);
//# sourceMappingURL=formateur-commercial-api.controller.js.map