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
exports.FormateurAlertsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const api_response_service_1 = require("../common/services/api-response.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const formateur_entity_1 = require("../entities/formateur.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
let FormateurAlertsController = class FormateurAlertsController {
    constructor(formateurRepository, stagiaireRepository, quizParticipationRepository, apiResponse) {
        this.formateurRepository = formateurRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.quizParticipationRepository = quizParticipationRepository;
        this.apiResponse = apiResponse;
    }
    async getAlerts(req) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
            relations: ["stagiaires", "stagiaires.user"],
        });
        const alerts = [];
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        for (const stagiaire of formateur.stagiaires) {
            const recentActivity = await this.quizParticipationRepository.count({
                where: {
                    stagiaire_id: stagiaire.id,
                },
            });
            if (recentActivity === 0 && stagiaire.statut) {
                alerts.push({
                    id: `inactive_${stagiaire.id}`,
                    type: "warning",
                    category: "inactivity",
                    title: "Stagiaire inactif",
                    message: `${stagiaire.user.prenom} ${stagiaire.user.nom} n'a pas participé depuis 7 jours`,
                    stagiaire_id: stagiaire.id,
                    stagiaire_name: `${stagiaire.user.prenom} ${stagiaire.user.nom}`,
                    priority: "medium",
                    created_at: new Date().toISOString(),
                });
            }
        }
        const deadlineStagiaires = formateur.stagiaires.filter((s) => {
            if (!s.date_fin_formation)
                return false;
            const deadline = new Date(s.date_fin_formation);
            const now = new Date();
            const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return daysLeft >= 0 && daysLeft <= 7;
        });
        deadlineStagiaires.forEach((stagiaire) => {
            const deadline = new Date(stagiaire.date_fin_formation);
            const now = new Date();
            const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            alerts.push({
                id: `deadline_${stagiaire.id}`,
                type: "info",
                category: "deadline",
                title: "Deadline approchante",
                message: `Formation de ${stagiaire.user.prenom} ${stagiaire.user.nom} se termine dans ${daysLeft} jour(s)`,
                stagiaire_id: stagiaire.id,
                stagiaire_name: `${stagiaire.user.prenom} ${stagiaire.user.nom}`,
                days_left: daysLeft,
                priority: daysLeft <= 3 ? "high" : "medium",
                created_at: new Date().toISOString(),
            });
        });
        const stagiaireIds = formateur.stagiaires.map((s) => s.id);
        const lowPerformers = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .select("qp.stagiaire_id", "stagiaire_id")
            .addSelect("AVG(qp.score)", "avg_score")
            .addSelect("COUNT(*)", "attempts")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .andWhere("qp.status = :status", { status: "completed" })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")
            .groupBy("qp.stagiaire_id")
            .having("avg_score < 50")
            .andHaving("attempts >= 3")
            .getRawMany();
        for (const performer of lowPerformers) {
            const stagiaire = formateur.stagiaires.find((s) => s.id == performer.stagiaire_id);
            if (stagiaire) {
                alerts.push({
                    id: `low_performance_${stagiaire.id}`,
                    type: "danger",
                    category: "performance",
                    title: "Performance faible",
                    message: `${stagiaire.user.prenom} ${stagiaire.user.nom} a un score moyen de ${Math.round(performer.avg_score * 10) / 10}% sur ${performer.attempts} quiz`,
                    stagiaire_id: stagiaire.id,
                    stagiaire_name: `${stagiaire.user.prenom} ${stagiaire.user.nom}`,
                    avg_score: Math.round(performer.avg_score * 10) / 10,
                    priority: "high",
                    created_at: new Date().toISOString(),
                });
            }
        }
        const highDropout = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .select("qp.stagiaire_id", "stagiaire_id")
            .addSelect("COUNT(*)", "total")
            .addSelect('SUM(CASE WHEN qp.status != "completed" THEN 1 ELSE 0 END)', "abandoned")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")
            .groupBy("qp.stagiaire_id")
            .having("total >= 3")
            .getRawMany();
        highDropout.forEach((dropout) => {
            const dropoutRate = (dropout.abandoned / dropout.total) * 100;
            if (dropoutRate > 60) {
                const stagiaire = formateur.stagiaires.find((s) => s.id == dropout.stagiaire_id);
                if (stagiaire) {
                    alerts.push({
                        id: `dropout_${stagiaire.id}`,
                        type: "warning",
                        category: "dropout",
                        title: "Taux d'abandon élevé",
                        message: `${stagiaire.user.prenom} ${stagiaire.user.nom} abandonne ${Math.round(dropoutRate * 10) / 10}% des quiz`,
                        stagiaire_id: stagiaire.id,
                        stagiaire_name: `${stagiaire.user.prenom} ${stagiaire.user.nom}`,
                        dropout_rate: Math.round(dropoutRate * 10) / 10,
                        priority: "high",
                        created_at: new Date().toISOString(),
                    });
                }
            }
        });
        const neverConnected = formateur.stagiaires.filter((s) => {
            const createdDate = new Date(s.created_at);
            const daysAgo = Math.ceil((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
            return daysAgo > 3;
        });
        for (const stagiaire of neverConnected) {
            const hasParticipation = await this.quizParticipationRepository.count({
                where: { stagiaire_id: stagiaire.id },
            });
            if (hasParticipation === 0) {
                const createdDate = new Date(stagiaire.created_at);
                const daysAgo = Math.ceil((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
                alerts.push({
                    id: `never_connected_${stagiaire.id}`,
                    type: "danger",
                    category: "never_connected",
                    title: "Jamais connecté",
                    message: `${stagiaire.user.prenom} ${stagiaire.user.nom} n'a jamais participé (inscrit il y a ${daysAgo} jours)`,
                    stagiaire_id: stagiaire.id,
                    stagiaire_name: `${stagiaire.user.prenom} ${stagiaire.user.nom}`,
                    days_since_registration: daysAgo,
                    priority: "high",
                    created_at: new Date().toISOString(),
                });
            }
        }
        alerts.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        return this.apiResponse.success({
            alerts,
            total_count: alerts.length,
            high_priority_count: alerts.filter((a) => a.priority === "high").length,
        });
    }
    async getAlertStats(req) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
            relations: ["stagiaires"],
        });
        const stagiaireIds = formateur.stagiaires.map((s) => s.id);
        const inactive = formateur.stagiaires.filter(async (s) => {
            const count = await this.quizParticipationRepository.count({
                where: { stagiaire_id: s.id },
            });
            return count === 0 && s.statut;
        }).length;
        const deadlineCount = formateur.stagiaires.filter((s) => {
            if (!s.date_fin_formation)
                return false;
            const deadline = new Date(s.date_fin_formation);
            const now = new Date();
            const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return daysLeft >= 0 && daysLeft <= 7;
        }).length;
        const lowPerformersCount = await this.quizParticipationRepository
            .createQueryBuilder("qp")
            .select("qp.stagiaire_id")
            .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
            .andWhere("qp.status = :status", { status: "completed" })
            .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")
            .groupBy("qp.stagiaire_id")
            .having("AVG(qp.score) < 50")
            .getCount();
        const neverConnectedCount = formateur.stagiaires.filter(async (s) => {
            const daysAgo = Math.ceil((new Date().getTime() - new Date(s.created_at).getTime()) /
                (1000 * 60 * 60 * 24));
            const count = await this.quizParticipationRepository.count({
                where: { stagiaire_id: s.id },
            });
            return daysAgo > 3 && count === 0;
        }).length;
        return this.apiResponse.success({
            stats: {
                inactive,
                approaching_deadline: deadlineCount,
                low_performance: lowPerformersCount,
                never_connected: neverConnectedCount,
                total: inactive + deadlineCount + lowPerformersCount + neverConnectedCount,
            },
        });
    }
};
exports.FormateurAlertsController = FormateurAlertsController;
__decorate([
    (0, common_1.Get)("alerts"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurAlertsController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Get)("alerts/stats"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurAlertsController.prototype, "getAlertStats", null);
exports.FormateurAlertsController = FormateurAlertsController = __decorate([
    (0, common_1.Controller)("formateur"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("formateur", "formatrice"),
    __param(0, (0, typeorm_1.InjectRepository)(formateur_entity_1.Formateur)),
    __param(1, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(2, (0, typeorm_1.InjectRepository)(quiz_participation_entity_1.QuizParticipation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], FormateurAlertsController);
//# sourceMappingURL=formateur-alerts.controller.js.map