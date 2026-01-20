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
exports.AdminDashboardController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const quiz_entity_1 = require("../entities/quiz.entity");
const formation_entity_1 = require("../entities/formation.entity");
const achievement_entity_1 = require("../entities/achievement.entity");
const api_response_service_1 = require("../common/services/api-response.service");
let AdminDashboardController = class AdminDashboardController {
    constructor(stagiaireRepository, quizRepository, formationRepository, achievementRepository, apiResponse) {
        this.stagiaireRepository = stagiaireRepository;
        this.quizRepository = quizRepository;
        this.formationRepository = formationRepository;
        this.achievementRepository = achievementRepository;
        this.apiResponse = apiResponse;
    }
    async getStatsDashboard(period = "30d") {
        let daysBack = 30;
        if (period.includes("d")) {
            daysBack = parseInt(period.replace("d", ""));
        }
        else if (period.includes("m")) {
            daysBack = parseInt(period.replace("m", "")) * 30;
        }
        const dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - daysBack);
        const totalStagiaires = await this.stagiaireRepository.count();
        const totalQuizzes = await this.quizRepository.count();
        const totalFormations = await this.formationRepository.count();
        const totalAchievements = await this.achievementRepository.count();
        const newStagiaires = await this.stagiaireRepository
            .createQueryBuilder("s")
            .where("s.created_at >= :date", { date: dateFrom })
            .getCount();
        const newQuizzes = await this.quizRepository
            .createQueryBuilder("q")
            .where("q.created_at >= :date", { date: dateFrom })
            .getCount();
        return this.apiResponse.success({
            stats: {
                total_stagiaires: totalStagiaires,
                total_quizzes: totalQuizzes,
                total_formations: totalFormations,
                total_achievements: totalAchievements,
                new_stagiaires: newStagiaires,
                new_quizzes: newQuizzes,
            },
            charts: {
                stagiaires_trend: await this.getStagiairesTrendByPeriod(daysBack),
                quizzes_trend: await this.getQuizzesTrendByPeriod(daysBack),
                top_formations: await this.getTopFormations(),
            },
            recent_activity: await this.getRecentActivity(),
        });
    }
    async getDashboardStats(req) {
        const totalStagiaires = await this.stagiaireRepository.count();
        const totalQuizzes = await this.quizRepository.count();
        const totalFormations = await this.formationRepository.count();
        const totalAchievements = await this.achievementRepository.count();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentStagiaires = await this.stagiaireRepository
            .createQueryBuilder("s")
            .where("s.created_at >= :date", { date: sevenDaysAgo })
            .getCount();
        const recentQuizzes = await this.quizRepository
            .createQueryBuilder("q")
            .where("q.created_at >= :date", { date: sevenDaysAgo })
            .getCount();
        return this.apiResponse.success({
            stats: {
                total_stagiaires: totalStagiaires,
                total_quizzes: totalQuizzes,
                total_formations: totalFormations,
                total_achievements: totalAchievements,
                recent_stagiaires: recentStagiaires,
                recent_quizzes: recentQuizzes,
            },
            charts: {
                stagiaires_trend: await this.getStagiairesTrend(),
                quizzes_trend: await this.getQuizzesTrend(),
                top_formations: await this.getTopFormations(),
            },
            recent_activity: await this.getRecentActivity(),
        });
    }
    async getStagiairesTrend() {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return this.stagiaireRepository
            .createQueryBuilder("s")
            .select("DATE(s.created_at) as date, COUNT(*) as count")
            .where("s.created_at >= :date", { date: lastMonth })
            .groupBy("DATE(s.created_at)")
            .getRawMany();
    }
    async getStagiairesTrendByPeriod(daysBack) {
        const dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - daysBack);
        return this.stagiaireRepository
            .createQueryBuilder("s")
            .select("DATE(s.created_at) as date, COUNT(*) as count")
            .where("s.created_at >= :date", { date: dateFrom })
            .groupBy("DATE(s.created_at)")
            .getRawMany();
    }
    async getQuizzesTrend() {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return this.quizRepository
            .createQueryBuilder("q")
            .select("DATE(q.created_at) as date, COUNT(*) as count")
            .where("q.created_at >= :date", { date: lastMonth })
            .groupBy("DATE(q.created_at)")
            .getRawMany();
    }
    async getQuizzesTrendByPeriod(daysBack) {
        const dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - daysBack);
        return this.quizRepository
            .createQueryBuilder("q")
            .select("DATE(q.created_at) as date, COUNT(*) as count")
            .where("q.created_at >= :date", { date: dateFrom })
            .groupBy("DATE(q.created_at)")
            .getRawMany();
    }
    async getTopFormations() {
        return this.formationRepository
            .createQueryBuilder("f")
            .select("f.titre as titre, COUNT(p.id) as count")
            .leftJoin("f.progressions", "p")
            .groupBy("f.id")
            .orderBy("count", "DESC")
            .take(5)
            .getRawMany();
    }
    async getRecentActivity() {
        const recentStagiaires = await this.stagiaireRepository.find({
            order: { created_at: "DESC" },
            take: 5,
            relations: ["user"],
        });
        const recentQuizzes = await this.quizRepository.find({
            order: { created_at: "DESC" },
            take: 5,
        });
        return {
            recent_stagiaires: recentStagiaires,
            recent_quizzes: recentQuizzes,
        };
    }
};
exports.AdminDashboardController = AdminDashboardController;
__decorate([
    (0, common_1.Get)("stats/dashboard-api"),
    __param(0, (0, common_1.Query)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getStatsDashboard", null);
__decorate([
    (0, common_1.Get)("dashboard"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getDashboardStats", null);
exports.AdminDashboardController = AdminDashboardController = __decorate([
    (0, common_1.Controller)("admin"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(1, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __param(2, (0, typeorm_1.InjectRepository)(formation_entity_1.Formation)),
    __param(3, (0, typeorm_1.InjectRepository)(achievement_entity_1.Achievement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], AdminDashboardController);
//# sourceMappingURL=admin-dashboard.controller.js.map