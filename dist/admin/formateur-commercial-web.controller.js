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
exports.CommercialWebController = exports.FormateurWebController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let FormateurWebController = class FormateurWebController {
    constructor() { }
    async dashboard(req) {
        return {
            message: "Formateur Dashboard",
            user: req.user,
        };
    }
    async catalogue() {
        return { message: "Catalogue de formations" };
    }
    async classement() {
        return { message: "Classement des stagiaires" };
    }
    async formations() {
        return { data: [], message: "Mes formations" };
    }
    async showFormation() {
        return { message: "Formation details" };
    }
    async profile(req) {
        return {
            message: "Formateur Profile",
            user: req.user,
        };
    }
    async updateProfile(req, data) {
        return {
            message: "Profile updated",
            user: req.user,
        };
    }
    async stagiaires() {
        return { data: [], message: "Tous les stagiaires" };
    }
    async stagiaireEnCours() {
        return { data: [], message: "Stagiaires en cours" };
    }
    async stagiaireTermines() {
        return { data: [], message: "Stagiaires terminés" };
    }
    async stagiaireApplication() {
        return { data: [], message: "Stagiaires application" };
    }
    async showStagiaire() {
        return { message: "Stagiaire details" };
    }
    async stagiaireClassement() {
        return { message: "Stagiaire classement details" };
    }
    async stats() {
        return { data: {}, message: "Statistics" };
    }
    async statsExport() {
        return { message: "Export CSV" };
    }
    async statsExportXlsx() {
        return { message: "Export XLSX" };
    }
    async affluence() {
        return { data: {}, message: "Affluence stats" };
    }
    async statsClassement() {
        return { data: {}, message: "Classement stats" };
    }
    async statsParFormation() {
        return { data: {}, message: "Stats par formation" };
    }
};
exports.FormateurWebController = FormateurWebController;
__decorate([
    (0, common_1.Get)("dashboard"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)("catalogue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "catalogue", null);
__decorate([
    (0, common_1.Get)("classement"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "classement", null);
__decorate([
    (0, common_1.Get)("formations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "formations", null);
__decorate([
    (0, common_1.Get)("formations/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "showFormation", null);
__decorate([
    (0, common_1.Get)("profile"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "profile", null);
__decorate([
    (0, common_1.Post)("profile"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)("stagiaires"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "stagiaires", null);
__decorate([
    (0, common_1.Get)("stagiaires/en-cours"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "stagiaireEnCours", null);
__decorate([
    (0, common_1.Get)("stagiaires/termines"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "stagiaireTermines", null);
__decorate([
    (0, common_1.Get)("stagiaires-application"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "stagiaireApplication", null);
__decorate([
    (0, common_1.Get)("stagiaires/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "showStagiaire", null);
__decorate([
    (0, common_1.Get)("stagiaires/:id/classement"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "stagiaireClassement", null);
__decorate([
    (0, common_1.Get)("stagiaires/stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)("stagiaires/stats/export"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "statsExport", null);
__decorate([
    (0, common_1.Get)("stagiaires/stats/export-xlsx"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "statsExportXlsx", null);
__decorate([
    (0, common_1.Get)("stats/affluence"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "affluence", null);
__decorate([
    (0, common_1.Get)("stats/classement"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "statsClassement", null);
__decorate([
    (0, common_1.Get)("stats/par-formation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurWebController.prototype, "statsParFormation", null);
exports.FormateurWebController = FormateurWebController = __decorate([
    (0, common_1.Controller)("formateur"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("formateur"),
    __metadata("design:paramtypes", [])
], FormateurWebController);
let CommercialWebController = class CommercialWebController {
    constructor() { }
    async dashboard(req) {
        return {
            message: "Commercial Dashboard",
            user: req.user,
        };
    }
    async affluence() {
        return { data: {}, message: "Affluence stats" };
    }
    async classement() {
        return { data: {}, message: "Classement stats" };
    }
    async parFormateur() {
        return { data: {}, message: "Stats par formateur" };
    }
    async parFormation() {
        return { data: {}, message: "Stats par formation" };
    }
};
exports.CommercialWebController = CommercialWebController;
__decorate([
    (0, common_1.Get)("dashboard"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommercialWebController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)("stats/affluence"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommercialWebController.prototype, "affluence", null);
__decorate([
    (0, common_1.Get)("stats/classement"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommercialWebController.prototype, "classement", null);
__decorate([
    (0, common_1.Get)("stats/par-formateur"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommercialWebController.prototype, "parFormateur", null);
__decorate([
    (0, common_1.Get)("stats/par-formation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommercialWebController.prototype, "parFormation", null);
exports.CommercialWebController = CommercialWebController = __decorate([
    (0, common_1.Controller)("commercial"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("commercial"),
    __metadata("design:paramtypes", [])
], CommercialWebController);
//# sourceMappingURL=formateur-commercial-web.controller.js.map