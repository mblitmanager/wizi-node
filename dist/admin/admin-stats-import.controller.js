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
exports.AdminInactivityController = exports.AdminImportController = exports.AdminStatsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let AdminStatsController = class AdminStatsController {
    constructor() { }
    async affluence() {
        return { data: {}, message: "Affluence statistics" };
    }
    async classement() {
        return { data: {}, message: "Classement statistics" };
    }
    async parCatalogue() {
        return { data: {}, message: "Stats par catalogue" };
    }
    async parFormateur() {
        return { data: {}, message: "Stats par formateur" };
    }
    async parFormation() {
        return { data: {}, message: "Stats par formation" };
    }
    async stagiaires(page = 1, limit = 10) {
        return {
            data: [],
            pagination: { total: 0, page, total_pages: 0 },
        };
    }
    async stagiaireExport(res) {
        res.setHeader("Content-Type", "text/csv");
        res.send("CSV export");
    }
    async stagiaireExportXlsx(res) {
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send("XLSX export");
    }
};
exports.AdminStatsController = AdminStatsController;
__decorate([
    (0, common_1.Get)("affluence"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminStatsController.prototype, "affluence", null);
__decorate([
    (0, common_1.Get)("classement"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminStatsController.prototype, "classement", null);
__decorate([
    (0, common_1.Get)("par-catalogue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminStatsController.prototype, "parCatalogue", null);
__decorate([
    (0, common_1.Get)("par-formateur"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminStatsController.prototype, "parFormateur", null);
__decorate([
    (0, common_1.Get)("par-formation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminStatsController.prototype, "parFormation", null);
__decorate([
    (0, common_1.Get)("stagiaires"),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminStatsController.prototype, "stagiaires", null);
__decorate([
    (0, common_1.Get)("stagiaires/export"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminStatsController.prototype, "stagiaireExport", null);
__decorate([
    (0, common_1.Get)("stagiaires/export-xlsx"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminStatsController.prototype, "stagiaireExportXlsx", null);
exports.AdminStatsController = AdminStatsController = __decorate([
    (0, common_1.Controller)("administrateur/stats"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __metadata("design:paramtypes", [])
], AdminStatsController);
let AdminImportController = class AdminImportController {
    constructor() { }
    async importStagiaires(data) {
        return { message: "Stagiaires imported", data };
    }
    async importQuiz(data) {
        return { message: "Quiz imported", data };
    }
    async importFormateur(data) {
        return { message: "Formateur imported", data };
    }
    async importCommercials(data) {
        return { message: "Commercials imported", data };
    }
    async importPrc(data) {
        return { message: "PRC imported", data };
    }
    async status() {
        return { status: "pending" };
    }
    async reports() {
        return { data: [], message: "Import reports" };
    }
    async getReport() {
        return { message: "Report file" };
    }
    async purgeReports() {
        return { message: "Reports purged" };
    }
    async newQuizQuestion(data) {
        return { message: "Question created", data };
    }
    async questionImport(data) {
        return { message: "Questions imported", data };
    }
};
exports.AdminImportController = AdminImportController;
__decorate([
    (0, common_1.Post)("stagiaires"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminImportController.prototype, "importStagiaires", null);
__decorate([
    (0, common_1.Post)("quiz"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminImportController.prototype, "importQuiz", null);
__decorate([
    (0, common_1.Post)("formateur"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminImportController.prototype, "importFormateur", null);
__decorate([
    (0, common_1.Post)("commercials"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminImportController.prototype, "importCommercials", null);
__decorate([
    (0, common_1.Post)("prc"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminImportController.prototype, "importPrc", null);
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminImportController.prototype, "status", null);
__decorate([
    (0, common_1.Get)("reports"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminImportController.prototype, "reports", null);
__decorate([
    (0, common_1.Get)("report/:filename"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminImportController.prototype, "getReport", null);
__decorate([
    (0, common_1.Post)("reports/purge"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminImportController.prototype, "purgeReports", null);
__decorate([
    (0, common_1.Post)("quiz-question/new"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminImportController.prototype, "newQuizQuestion", null);
__decorate([
    (0, common_1.Post)("question-import"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminImportController.prototype, "questionImport", null);
exports.AdminImportController = AdminImportController = __decorate([
    (0, common_1.Controller)("administrateur/import"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __metadata("design:paramtypes", [])
], AdminImportController);
let AdminInactivityController = class AdminInactivityController {
    constructor() { }
    async index() {
        return { data: [], message: "Inactive users" };
    }
    async notify() {
        return { message: "Notifications sent" };
    }
    async userAppUsages(page = 1, limit = 10) {
        return {
            data: [],
            pagination: { total: 0, page, total_pages: 0 },
        };
    }
    async userAppUsagesExport() {
        return { message: "Export data" };
    }
    async downloadCommercialModel(res) {
        res.setHeader("Content-Type", "text/csv");
        res.send("CSV Template");
    }
    async downloadFormateurModel(res) {
        res.setHeader("Content-Type", "text/csv");
        res.send("CSV Template");
    }
    async downloadPrcModel(res) {
        res.setHeader("Content-Type", "text/csv");
        res.send("CSV Template");
    }
    async downloadStagiaireModel(res) {
        res.setHeader("Content-Type", "text/csv");
        res.send("CSV Template");
    }
    async downloadQuizModel(res) {
        res.setHeader("Content-Type", "text/csv");
        res.send("CSV Template");
    }
    async manual() {
        return { message: "Manual" };
    }
};
exports.AdminInactivityController = AdminInactivityController;
__decorate([
    (0, common_1.Get)("inactivity"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminInactivityController.prototype, "index", null);
__decorate([
    (0, common_1.Post)("inactivity/notify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminInactivityController.prototype, "notify", null);
__decorate([
    (0, common_1.Get)("user-app-usages"),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminInactivityController.prototype, "userAppUsages", null);
__decorate([
    (0, common_1.Get)("user-app-usages/export"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminInactivityController.prototype, "userAppUsagesExport", null);
__decorate([
    (0, common_1.Get)("telecharger-modele-commercial"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminInactivityController.prototype, "downloadCommercialModel", null);
__decorate([
    (0, common_1.Get)("telecharger-modele-formateur"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminInactivityController.prototype, "downloadFormateurModel", null);
__decorate([
    (0, common_1.Get)("telecharger-modele-prc"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminInactivityController.prototype, "downloadPrcModel", null);
__decorate([
    (0, common_1.Get)("telecharger-modele-stagiaire"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminInactivityController.prototype, "downloadStagiaireModel", null);
__decorate([
    (0, common_1.Get)("telecharger-modele-quiz"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminInactivityController.prototype, "downloadQuizModel", null);
__decorate([
    (0, common_1.Get)("manual"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminInactivityController.prototype, "manual", null);
exports.AdminInactivityController = AdminInactivityController = __decorate([
    (0, common_1.Controller)("administrateur"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __metadata("design:paramtypes", [])
], AdminInactivityController);
//# sourceMappingURL=admin-stats-import.controller.js.map