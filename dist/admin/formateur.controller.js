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
exports.FormateurController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const api_response_service_1 = require("../common/services/api-response.service");
const admin_service_1 = require("./admin.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quiz_entity_1 = require("../entities/quiz.entity");
const question_entity_1 = require("../entities/question.entity");
const reponse_entity_1 = require("../entities/reponse.entity");
const formation_entity_1 = require("../entities/formation.entity");
const formateur_entity_1 = require("../entities/formateur.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
const stagiaire_catalogue_formation_entity_1 = require("../entities/stagiaire-catalogue-formation.entity");
let FormateurController = class FormateurController {
    constructor(adminService, apiResponse, quizRepository, questionRepository, reponseRepository, formationRepository, formateurRepository, stagiaireRepository, quizParticipationRepository, catalogueFormationRepository, stagiaireCatalogueFormationRepository) {
        this.adminService = adminService;
        this.apiResponse = apiResponse;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.reponseRepository = reponseRepository;
        this.formationRepository = formationRepository;
        this.formateurRepository = formateurRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.quizParticipationRepository = quizParticipationRepository;
        this.catalogueFormationRepository = catalogueFormationRepository;
        this.stagiaireCatalogueFormationRepository = stagiaireCatalogueFormationRepository;
    }
    async dashboardHome(req, days = 7) {
        const data = await this.adminService.getFormateurDashboardHome(req.user.id, days);
        return this.apiResponse.success(data);
    }
    async dashboardStats(req) {
        const stats = await this.adminService.getFormateurDashboardStats(req.user.id);
        return this.apiResponse.success(stats);
    }
    async trends(req) {
        const data = await this.adminService.getFormateurTrends(req.user.id);
        return this.apiResponse.success(data);
    }
    async getAlerts(req) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
            relations: ["stagiaires", "stagiaires.user"],
        });
        const alerts = [];
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        if (!formateur)
            return this.apiResponse.success({ alerts: [] });
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        for (const stagiaire of formateur.stagiaires) {
            if (!stagiaire.statut)
                continue;
            const lastActivity = stagiaire.user?.last_activity_at;
            const isInactive = !lastActivity || new Date(lastActivity) < weekAgo;
            if (isInactive) {
                alerts.push({
                    id: `inactive_${stagiaire.id}`,
                    type: "warning",
                    category: "inactivity",
                    title: "Stagiaire inactif",
                    message: `${stagiaire.prenom} ${stagiaire.user?.name || ""} n'a pas eu d'activité depuis 7 jours`,
                    stagiaire_id: stagiaire.id,
                    stagiaire_name: `${stagiaire.prenom} ${stagiaire.user?.name || ""}`,
                    priority: "medium",
                    created_at: new Date().toISOString(),
                });
            }
        }
        for (const stagiaire of formateur.stagiaires) {
            if (!stagiaire.date_fin_formation)
                continue;
            const deadline = new Date(stagiaire.date_fin_formation);
            const now = new Date();
            const diff = deadline.getTime() - now.getTime();
            const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
            if (daysLeft >= 0 && daysLeft <= 7) {
                alerts.push({
                    id: `deadline_${stagiaire.id}`,
                    type: "info",
                    category: "deadline",
                    title: "Fin de formation proche",
                    message: `La formation de ${stagiaire.prenom} se termine dans ${daysLeft} jour(s)`,
                    stagiaire_id: stagiaire.id,
                    stagiaire_name: `${stagiaire.prenom} ${stagiaire.user?.name || ""}`,
                    days_left: daysLeft,
                    priority: daysLeft <= 3 ? "high" : "medium",
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
    async stagiaires(req) {
        const data = await this.adminService.getFormateurStagiaires(req.user.id);
        return this.apiResponse.success({ stagiaires: data });
    }
    async onlineStagiaires(req) {
        const data = await this.adminService.getFormateurOnlineStagiaires(req.user.id);
        return this.apiResponse.success({ stagiaires: data, total: data.length });
    }
    async inactiveStagiaires(req, days = 7, scope = "all") {
        const stats = await this.adminService.getFormateurInactiveStagiaires(req.user.id, days, scope);
        return this.apiResponse.success(stats);
    }
    async unassignedStagiaires(req, id) {
        const data = await this.adminService.getUnassignedStagiaires(id, req.user.id);
        return this.apiResponse.success({ stagiaires: data });
    }
    async stagiaireStats(id) {
        const stats = await this.adminService.getStagiaireProfileById(id);
        if (!stats)
            throw new common_1.HttpException("Stagiaire non trouvé", common_1.HttpStatus.NOT_FOUND);
        return this.apiResponse.success(stats);
    }
    async stagiaireProfile(id) {
        const stats = await this.adminService.getStagiaireProfileById(id);
        if (!stats)
            throw new common_1.HttpException("Stagiaire non trouvé", common_1.HttpStatus.NOT_FOUND);
        return this.apiResponse.success(stats);
    }
    async sendEmail(req, body) {
        const result = await this.adminService.sendFormateurEmail(req.user.id, body.recipient_ids, body.subject, body.message);
        return this.apiResponse.success(result);
    }
    async disconnect(data) {
        const updatedCount = await this.adminService.disconnectStagiaires(data.stagiaire_ids);
        return this.apiResponse.success({
            success: true,
            message: `${updatedCount} stagiaire(s) déconnecté(s)`,
        });
    }
    async quizzes(req, formationId, status, search, page = 1, limit = 10) {
        const formateur = await this.formateurRepository.findOne({
            where: { user_id: req.user.id },
        });
        if (!formateur) {
            throw new common_1.HttpException("Formateur non trouvé", common_1.HttpStatus.NOT_FOUND);
        }
        const stagiaireFormationIdsRaw = await this.stagiaireCatalogueFormationRepository
            .createQueryBuilder("scf")
            .innerJoin("scf.stagiaire", "s")
            .innerJoin("s.formateurs", "f", "f.id = :formateurId", {
            formateurId: formateur.id,
        })
            .innerJoin("scf.catalogue_formation", "cf")
            .select("DISTINCT cf.formation_id", "fid")
            .getRawMany();
        const allowedFormationIds = stagiaireFormationIdsRaw
            .map((row) => row.fid)
            .filter((id) => id !== null);
        const queryBuilder = this.quizRepository
            .createQueryBuilder("quiz")
            .leftJoinAndSelect("quiz.formation", "formation")
            .leftJoinAndSelect("quiz.questions", "questions");
        if (allowedFormationIds.length > 0) {
            queryBuilder.andWhere("quiz.formation_id IN (:...allowedFormationIds)", {
                allowedFormationIds,
            });
        }
        else {
            queryBuilder.andWhere("1 = 0");
        }
        if (formationId) {
            const legacyCatalogueFormation = await this.catalogueFormationRepository.findOne({
                where: { id: formationId },
                select: ["id", "formation_id"],
            });
            const targetFid = legacyCatalogueFormation?.formation_id || formationId;
            queryBuilder.andWhere("quiz.formation_id = :targetFid", { targetFid });
        }
        if (status) {
            queryBuilder.andWhere("quiz.status = :status", { status });
        }
        if (search) {
            queryBuilder.andWhere("(quiz.titre LIKE :search OR quiz.description LIKE :search)", { search: `%${search}%` });
        }
        const [items, total] = await queryBuilder
            .orderBy("quiz.created_at", "DESC")
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        const data = items.map((q) => ({
            id: q.id,
            titre: q.titre,
            description: q.description,
            niveau: q.niveau,
            duree: q.duree,
            status: q.status,
            formation_id: q.formation_id,
            formation: q.formation
                ? {
                    id: q.formation.id,
                    nom: q.formation.titre,
                    title: q.formation.titre,
                }
                : null,
            nb_questions: q.questions?.length || 0,
            created_at: q.created_at,
        }));
        return this.apiResponse.success({
            data,
            meta: {
                total,
                page: Number(page),
                last_page: Math.ceil(total / limit),
            },
            quizzes: data,
        });
    }
    async quizDetail(id) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
            relations: ["questions", "questions.reponses", "formation"],
        });
        if (!quiz)
            throw new common_1.HttpException("Quiz non trouvé", common_1.HttpStatus.NOT_FOUND);
        const questions = (quiz.questions || []).map((q) => ({
            id: q.id,
            question: q.text,
            type: q.type,
            astuce: q.astuce,
            reponses: (q.reponses || []).map((r) => ({
                id: r.id,
                reponse: r.text,
                correct: !!r.isCorrect,
            })),
        }));
        return this.apiResponse.success({
            quiz: {
                id: quiz.id,
                titre: quiz.titre,
                description: quiz.description,
                niveau: quiz.niveau,
                duree: quiz.duree,
                status: quiz.status,
                formation_id: quiz.formation_id,
                formation: quiz.formation
                    ? { id: quiz.formation.id, nom: quiz.formation.titre }
                    : null,
            },
            questions,
        });
    }
    async storeQuiz(data) {
        const quiz = this.quizRepository.create({
            titre: data.titre,
            description: data.description,
            duree: data.duree,
            niveau: data.niveau,
            formation_id: data.formation_id,
            status: data.status || "brouillon",
            nb_points_total: "0",
        });
        await this.quizRepository.save(quiz);
        return this.apiResponse.success({ quiz }, "Quiz créé avec succès");
    }
    async publishQuiz(id) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
            relations: ["questions"],
        });
        if (!quiz)
            throw new common_1.HttpException("Quiz non trouvé", common_1.HttpStatus.NOT_FOUND);
        if ((quiz.questions?.length || 0) === 0)
            throw new common_1.HttpException("Quiz sans questions", common_1.HttpStatus.BAD_REQUEST);
        quiz.status = "actif";
        await this.quizRepository.save(quiz);
        return this.apiResponse.success(null, "Quiz publié");
    }
    async deleteQuiz(id) {
        const quiz = await this.quizRepository.findOne({ where: { id } });
        if (!quiz)
            throw new common_1.HttpException("Quiz non trouvé", common_1.HttpStatus.NOT_FOUND);
        await this.quizRepository.remove(quiz);
        return this.apiResponse.success(null, "Quiz supprimé");
    }
    async addQuestion(id, data) {
        const question = this.questionRepository.create({
            quiz_id: id,
            text: data.question,
            type: data.type || "qcm",
            astuce: data.astuce,
            points: "1",
        });
        await this.questionRepository.save(question);
        if (data.reponses) {
            for (const r of data.reponses) {
                const reponse = this.reponseRepository.create({
                    question_id: question.id,
                    text: r.reponse,
                    isCorrect: !!r.correct,
                });
                await this.reponseRepository.save(reponse);
            }
        }
        return this.apiResponse.success(question, "Question ajoutée");
    }
    async deleteQuestion(quizId, questionId) {
        const question = await this.questionRepository.findOne({
            where: { id: questionId, quiz_id: quizId },
        });
        if (!question)
            throw new common_1.HttpException("Question non trouvée", common_1.HttpStatus.NOT_FOUND);
        await this.questionRepository.remove(question);
        return this.apiResponse.success(null, "Question supprimée");
    }
    async formations(req) {
        const data = await this.adminService.getFormateurFormations(req.user.id);
        return this.apiResponse.success({ formations: data });
    }
    async availableFormations() {
        const data = await this.adminService.getFormateurAvailableFormations();
        return this.apiResponse.success({ formations: data });
    }
    async formationStats(req, id) {
        const stats = await this.adminService.getFormationStats(id, req.user.id);
        if (!stats)
            throw new common_1.HttpException("Statistiques non trouvées", common_1.HttpStatus.NOT_FOUND);
        return this.apiResponse.success(stats);
    }
    async formationStagiaires(req, id) {
        const data = await this.adminService.getFormateurFormationStagiaires(req.user.id, id);
        return this.apiResponse.success(data);
    }
    async assignFormation(req, id, body) {
        const { stagiaire_ids, date_debut, date_fin } = body;
        const result = await this.adminService.assignFormateurFormationStagiaires(req.user.id, id, stagiaire_ids, date_debut, date_fin);
        return this.apiResponse.success(result);
    }
    async formationsVideos(req) {
        const data = await this.adminService.getFormateurFormationsWithVideos(req.user.id);
        return this.apiResponse.success({ data });
    }
    async formationsList() {
        const formations = await this.formationRepository.find({
            select: ["id", "titre"],
            order: { titre: "ASC" },
        });
        return this.apiResponse.success({ formations });
    }
    async videoStats(id) {
        const stats = await this.adminService.getVideoStats(id);
        return this.apiResponse.success(stats);
    }
    async arenaRanking(period = "all", formationId) {
        const data = await this.adminService.getTrainerArenaRanking(period, formationId);
        return this.apiResponse.success(data);
    }
    async rankingByFormation(id, period = "all") {
        const ranking = await this.adminService.getRankingByFormation(id, period);
        return this.apiResponse.success({ ranking });
    }
    async mesStagiairesRanking(req, period = "all") {
        const data = await this.adminService.getMyStagiairesRanking(req.user.id, period);
        return this.apiResponse.success(data);
    }
    async formationsPerformance(req) {
        const data = await this.adminService.getFormateurFormationsPerformance(req.user.id);
        return this.apiResponse.success(data);
    }
    async studentsPerformance(req) {
        const performance = await this.adminService.getFormateurStudentsPerformance(req.user.id);
        const mostQuizzes = [...performance]
            .sort((a, b) => b.total_quizzes - a.total_quizzes)
            .slice(0, 3);
        const mostActive = [...performance]
            .sort((a, b) => b.total_logins - a.total_logins)
            .slice(0, 3);
        return this.apiResponse.success({
            performance,
            rankings: {
                most_quizzes: mostQuizzes,
                most_active: mostActive,
            },
        });
    }
    async stagiaireFormationDetails(id) {
        const details = await this.adminService.getStagiaireFullFormations(id);
        return this.apiResponse.success(details);
    }
    async formationsPerformanceLegacy(req) {
        const data = await this.adminService.getFormateurFormationsPerformance(req.user.id);
        return this.apiResponse.success(data);
    }
    async analyticsDashboard(req, period = 30, formationId) {
        const data = await this.adminService.getFormateurAnalyticsDashboard(req.user.id, period, formationId);
        return this.apiResponse.success(data);
    }
    async quizSuccessRate(req, period = 30, formationId) {
        const data = await this.adminService.getFormateurQuizSuccessRate(req.user.id, period, formationId);
        return this.apiResponse.success(data);
    }
    async completionTime() {
        return this.apiResponse.success({ completion_trends: [] });
    }
    async activityHeatmap(req, period = 30, formationId) {
        const data = await this.adminService.getFormateurActivityHeatmap(req.user.id, period, formationId);
        return this.apiResponse.success(data);
    }
    async dropoutRate(req, formationId) {
        const data = await this.adminService.getFormateurDropoutRate(req.user.id, formationId);
        return this.apiResponse.success(data);
    }
    async sendNotification(req, data) {
        const { recipient_ids, title, body } = data;
        const result = await this.adminService.sendNotification(req.user.id, recipient_ids, title, body);
        return this.apiResponse.success(result);
    }
    async seguimientoDemandes(req) {
        const data = await this.adminService.getDemandesSuivi(req.user.id, req.user.role);
        return this.apiResponse.success(data);
    }
    async seguimientoParrainage(req) {
        const data = await this.adminService.getParrainageSuivi(req.user.id, req.user.role);
        return this.apiResponse.success(data);
    }
};
exports.FormateurController = FormateurController;
__decorate([
    (0, common_1.Get)("dashboard/home"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("days")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "dashboardHome", null);
__decorate([
    (0, common_1.Get)("dashboard/stats"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "dashboardStats", null);
__decorate([
    (0, common_1.Get)("trends"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "trends", null);
__decorate([
    (0, common_1.Get)("alerts"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Get)("stagiaires"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "stagiaires", null);
__decorate([
    (0, common_1.Get)("stagiaires/online"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "onlineStagiaires", null);
__decorate([
    (0, common_1.Get)("stagiaires/inactive"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("days")),
    __param(2, (0, common_1.Query)("scope")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "inactiveStagiaires", null);
__decorate([
    (0, common_1.Get)("stagiaires/unassigned/:id"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "unassignedStagiaires", null);
__decorate([
    (0, common_1.Get)("stagiaire/:id/stats"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "stagiaireStats", null);
__decorate([
    (0, common_1.Get)("stagiaire/:id/profile"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "stagiaireProfile", null);
__decorate([
    (0, common_1.Post)("send-email"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Post)("stagiaires/disconnect"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "disconnect", null);
__decorate([
    (0, common_1.Get)("quizzes"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("formation_id")),
    __param(2, (0, common_1.Query)("status")),
    __param(3, (0, common_1.Query)("search")),
    __param(4, (0, common_1.Query)("page")),
    __param(5, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "quizzes", null);
__decorate([
    (0, common_1.Get)("quizzes/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "quizDetail", null);
__decorate([
    (0, common_1.Post)("quizzes"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "storeQuiz", null);
__decorate([
    (0, common_1.Post)("quizzes/:id/publish"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "publishQuiz", null);
__decorate([
    (0, common_1.Delete)("quizzes/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "deleteQuiz", null);
__decorate([
    (0, common_1.Post)("quizzes/:id/questions"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "addQuestion", null);
__decorate([
    (0, common_1.Delete)("quizzes/:quizId/questions/:questionId"),
    __param(0, (0, common_1.Param)("quizId")),
    __param(1, (0, common_1.Param)("questionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Get)("formations"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "formations", null);
__decorate([
    (0, common_1.Get)("formations/available"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "availableFormations", null);
__decorate([
    (0, common_1.Get)("formations/:id/stats"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "formationStats", null);
__decorate([
    (0, common_1.Get)("formations/:id/stagiaires"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "formationStagiaires", null);
__decorate([
    (0, common_1.Post)("formations/:id/assign"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "assignFormation", null);
__decorate([
    (0, common_1.Get)("formations-videos"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "formationsVideos", null);
__decorate([
    (0, common_1.Get)("formations-list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "formationsList", null);
__decorate([
    (0, common_1.Get)("video/:id/stats"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "videoStats", null);
__decorate([
    (0, common_1.Get)("classement/arena"),
    __param(0, (0, common_1.Query)("period")),
    __param(1, (0, common_1.Query)("formation_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "arenaRanking", null);
__decorate([
    (0, common_1.Get)("classement/formation/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "rankingByFormation", null);
__decorate([
    (0, common_1.Get)("classement/mes-stagiaires"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "mesStagiairesRanking", null);
__decorate([
    (0, common_1.Get)("analytics/formations/performance"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "formationsPerformance", null);
__decorate([
    (0, common_1.Get)("analytics/performance"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "studentsPerformance", null);
__decorate([
    (0, common_1.Get)("analytics/stagiaire/:id/formations"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "stagiaireFormationDetails", null);
__decorate([
    (0, common_1.Get)("analytics/formations-performance"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "formationsPerformanceLegacy", null);
__decorate([
    (0, common_1.Get)("analytics/dashboard"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("period")),
    __param(2, (0, common_1.Query)("formation_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "analyticsDashboard", null);
__decorate([
    (0, common_1.Get)("analytics/quiz-success-rate"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("period")),
    __param(2, (0, common_1.Query)("formation_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "quizSuccessRate", null);
__decorate([
    (0, common_1.Get)("analytics/completion-time"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "completionTime", null);
__decorate([
    (0, common_1.Get)("analytics/activity-heatmap"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("period")),
    __param(2, (0, common_1.Query)("formation_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "activityHeatmap", null);
__decorate([
    (0, common_1.Get)("analytics/dropout-rate"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("formation_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "dropoutRate", null);
__decorate([
    (0, common_1.Post)("send-notification"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Get)("suivi/demandes"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "seguimientoDemandes", null);
__decorate([
    (0, common_1.Get)("suivi/parrainage"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurController.prototype, "seguimientoParrainage", null);
exports.FormateurController = FormateurController = __decorate([
    (0, common_1.Controller)("formateur"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("formateur", "formatrice"),
    __param(2, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __param(3, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(4, (0, typeorm_1.InjectRepository)(reponse_entity_1.Reponse)),
    __param(5, (0, typeorm_1.InjectRepository)(formation_entity_1.Formation)),
    __param(6, (0, typeorm_1.InjectRepository)(formateur_entity_1.Formateur)),
    __param(7, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(8, (0, typeorm_1.InjectRepository)(quiz_participation_entity_1.QuizParticipation)),
    __param(9, (0, typeorm_1.InjectRepository)(catalogue_formation_entity_1.CatalogueFormation)),
    __param(10, (0, typeorm_1.InjectRepository)(stagiaire_catalogue_formation_entity_1.StagiaireCatalogueFormation)),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        api_response_service_1.ApiResponseService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FormateurController);
//# sourceMappingURL=formateur.controller.js.map