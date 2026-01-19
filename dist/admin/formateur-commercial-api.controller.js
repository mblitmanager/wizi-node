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
let FormateurApiController = class FormateurApiController {
    constructor(apiResponse, adminService) {
        this.apiResponse = apiResponse;
        this.adminService = adminService;
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
    async onlineStagiaires() {
        const data = await this.adminService.getOnlineStagiaires();
        return this.apiResponse.success({
            stagiaires: data,
            total: data.length,
        });
    }
    async inactiveStagiaires(req, days = 7, scope = "all") {
        const stats = await this.adminService.getFormateurInactiveStagiaires(req.user.id, days, scope);
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
    async mesStagiairesRanking(req, period = "all") {
        const data = await this.adminService.getFormateurMesStagiairesRanking(req.user.id, period);
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
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
    (0, common_1.Get)("stats/dashboard"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "stats", null);
exports.FormateurApiController = FormateurApiController = __decorate([
    (0, common_1.Controller)("formateur"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("formateur", "formatrice"),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService,
        admin_service_1.AdminService])
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