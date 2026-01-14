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
let FormateurApiController = class FormateurApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async dashboardStats(req) {
        return this.apiResponse.success({});
    }
    async formations(req) {
        return this.apiResponse.success([]);
    }
    async stagiaires(req) {
        return this.apiResponse.success([]);
    }
    async onlineStagiaires() {
        return this.apiResponse.success([]);
    }
    async inactiveStagiaires() {
        return this.apiResponse.success([]);
    }
    async neverConnected() {
        return this.apiResponse.success([]);
    }
    async performance() {
        const mockStats = {
            rankings: {
                most_quizzes: [],
                most_active: [],
            },
            performance: [],
        };
        return this.apiResponse.success(mockStats);
    }
    async disconnect(data) {
        return this.apiResponse.success();
    }
    async stagiaireStats(id) {
        return this.apiResponse.success({});
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
    async mesStagiairesRanking() {
        return this.apiResponse.success([]);
    }
    async sendEmail(data) {
        return this.apiResponse.success();
    }
    async sendNotification(data) {
        return this.apiResponse.success();
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "performance", null);
__decorate([
    (0, common_1.Post)("stagiaires/disconnect"),
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
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
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Get)("stats/dashboard"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurApiController.prototype, "stats", null);
exports.FormateurApiController = FormateurApiController = __decorate([
    (0, common_1.Controller)("formateur"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], FormateurApiController);
let CommercialApiController = class CommercialApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async dashboard(req) {
        return this.apiResponse.success({});
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
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], CommercialApiController);
//# sourceMappingURL=formateur-commercial-api.controller.js.map