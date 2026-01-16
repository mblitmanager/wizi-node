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
const api_response_service_1 = require("../common/services/api-response.service");
let FormateurWebController = class FormateurWebController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async dashboard(req) {
        return this.apiResponse.success({
            user: req.user,
        });
    }
    async catalogue() {
        return this.apiResponse.success({});
    }
    async classement() {
        return this.apiResponse.success({});
    }
    async showFormation() {
        return this.apiResponse.success({});
    }
    async profile(req) {
        return this.apiResponse.success({
            user: req.user,
        });
    }
    async updateProfile(req, data) {
        return this.apiResponse.success({
            user: req.user,
        });
    }
    async stagiaireEnCours() {
        return this.apiResponse.success([]);
    }
    async stagiaireTermines() {
        return this.apiResponse.success([]);
    }
    async stagiaireApplication() {
        return this.apiResponse.success([]);
    }
    async showStagiaire() {
        return this.apiResponse.success({});
    }
    async stagiaireClassement() {
        return this.apiResponse.success({});
    }
    async stats() {
        return this.apiResponse.success({});
    }
    async statsExport() {
        return this.apiResponse.success({});
    }
    async statsExportXlsx() {
        return this.apiResponse.success({});
    }
    async affluence() {
        return this.apiResponse.success({});
    }
    async statsClassement() {
        return this.apiResponse.success({});
    }
    async statsParFormation() {
        return this.apiResponse.success({});
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
    (0, roles_decorator_1.Roles)("formateur", "formatrice"),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], FormateurWebController);
let CommercialWebController = class CommercialWebController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async dashboard(req) {
        return this.apiResponse.success({
            stats: {
                totalStagiaires: 0,
                totalQuizzes: 0,
                avgScore: 0,
                totalParticipations: 0,
            },
            statsByFormation: [],
            topStagiaires: [],
            affluence: [],
            recentQuizzes: [],
        });
    }
    async affluence() {
        return this.apiResponse.success({});
    }
    async classement() {
        return this.apiResponse.success({});
    }
    async parFormateur() {
        return this.apiResponse.success({});
    }
    async parFormation() {
        return this.apiResponse.success({});
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
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], CommercialWebController);
//# sourceMappingURL=formateur-commercial-web.controller.js.map