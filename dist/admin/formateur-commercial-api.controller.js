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
let FormateurApiController = class FormateurApiController {
    constructor() { }
    async dashboardStats(req) {
        return { data: {}, message: "Dashboard stats" };
    }
    async formations(req) {
        return { data: [], message: "My formations" };
    }
    async stagiaires(req) {
        return { data: [], message: "My stagiaires" };
    }
    async onlineStagiaires() {
        return { data: [], message: "Online stagiaires" };
    }
    async inactiveStagiaires() {
        return { data: [], message: "Inactive stagiaires" };
    }
    async neverConnected() {
        return { data: [], message: "Never connected" };
    }
    async performance() {
        return { data: [], message: "Performance stats" };
    }
    async disconnect(data) {
        return { message: "Stagiaires disconnected" };
    }
    async stagiaireStats(id) {
        return { data: {}, message: "Stagiaire stats" };
    }
    async videoStats(id) {
        return { data: {}, message: "Video stats" };
    }
    async videos() {
        return { data: [], message: "All videos" };
    }
    async formationRanking(formationId) {
        return { data: [], message: "Formation ranking" };
    }
    async mesStagiairesRanking() {
        return { data: [], message: "My stagiaires ranking" };
    }
    async sendEmail(data) {
        return { message: "Email sent" };
    }
    async sendNotification(data) {
        return { message: "Notification sent" };
    }
    async stats() {
        return { data: {}, message: "Statistics" };
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
    (0, common_1.Controller)("api/formateur"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [])
], FormateurApiController);
let CommercialApiController = class CommercialApiController {
    constructor() { }
    async dashboard(req) {
        return { data: {}, message: "Commercial dashboard" };
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
    (0, common_1.Controller)("api/commercial/stats"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [])
], CommercialApiController);
//# sourceMappingURL=formateur-commercial-api.controller.js.map