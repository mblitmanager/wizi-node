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
exports.ParrainageController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const parrainage_service_1 = require("./parrainage.service");
const formation_service_1 = require("../formation/formation.service");
let ParrainageController = class ParrainageController {
    constructor(parrainageService, formationService) {
        this.parrainageService = parrainageService;
        this.formationService = formationService;
    }
    async getFormationParrainage() {
        return this.formationService.getFormationParrainage();
    }
    async getEvents() {
        return this.parrainageService.getEvents();
    }
    async getParrainData(token) {
        return this.parrainageService.getParrainData(token);
    }
    async registerFilleul(data) {
        return this.parrainageService.registerFilleul(data);
    }
    async generateLink(req) {
        return this.parrainageService.generateLink(req.user.id);
    }
    async getStatsParrain(req) {
        return this.parrainageService.getStatsParrain(req.user.id);
    }
    async getStatsParrainById(parrainId) {
        return this.parrainageService.getStatsParrain(parrainId);
    }
    async getFilleuls(req) {
        return this.parrainageService.getFilleuls(req.user.id);
    }
    async getRewards(req) {
        return this.parrainageService.getRewards(req.user.id);
    }
    async getHistory(req) {
        return this.parrainageService.getHistory(req.user.id);
    }
};
exports.ParrainageController = ParrainageController;
__decorate([
    (0, common_1.Get)("formationParrainage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParrainageController.prototype, "getFormationParrainage", null);
__decorate([
    (0, common_1.Get)("parrainage-events"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParrainageController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Get)("parrainage/get-data/:token"),
    __param(0, (0, common_1.Param)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParrainageController.prototype, "getParrainData", null);
__decorate([
    (0, common_1.Post)("parrainage/register-filleul"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParrainageController.prototype, "registerFilleul", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Post)("parrainage/generate-link"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParrainageController.prototype, "generateLink", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("stagiaire/parrainage/stats"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParrainageController.prototype, "getStatsParrain", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("parrainage/stats/:parrainId"),
    __param(0, (0, common_1.Param)("parrainId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ParrainageController.prototype, "getStatsParrainById", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("stagiaire/parrainage/filleuls"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParrainageController.prototype, "getFilleuls", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("stagiaire/parrainage/rewards"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParrainageController.prototype, "getRewards", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("stagiaire/parrainage/history"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParrainageController.prototype, "getHistory", null);
exports.ParrainageController = ParrainageController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [parrainage_service_1.ParrainageService,
        formation_service_1.FormationService])
], ParrainageController);
//# sourceMappingURL=parrainage.controller.js.map