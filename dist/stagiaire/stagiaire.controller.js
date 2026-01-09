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
exports.StagiaireController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const stagiaire_service_1 = require("./stagiaire.service");
let StagiaireController = class StagiaireController {
    constructor(stagiaireService) {
        this.stagiaireService = stagiaireService;
    }
    async getProfile(req) {
        return this.stagiaireService.getProfile(req.user.id);
    }
    async testAuth() {
        return { message: "Public endpoint works" };
    }
    async getHomeData(req) {
        try {
            return await this.stagiaireService.getHomeData(req.user.id);
        }
        catch (error) {
            console.error("Error in getHomeData:", error);
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getContacts(req) {
        try {
            return await this.stagiaireService.getContacts(req.user.id);
        }
        catch (error) {
            console.error("Error in getContacts:", error);
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCommerciaux(req) {
        try {
            return await this.stagiaireService.getContactsByType(req.user.id, "commercial");
        }
        catch (error) {
            console.error("Error in getCommerciaux:", error);
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getFormateurs(req) {
        try {
            return await this.stagiaireService.getContactsByType(req.user.id, "formateur");
        }
        catch (error) {
            console.error("Error in getFormateurs:", error);
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPoleRelation(req) {
        try {
            return await this.stagiaireService.getContactsByType(req.user.id, "pole-relation");
        }
        catch (error) {
            console.error("Error in getPoleRelation:", error);
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPoleSave(req) {
        try {
            return await this.stagiaireService.getContactsByType(req.user.id, "pole-save");
        }
        catch (error) {
            console.error("Error in getPoleSave:", error);
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMyQuizzes(req) {
        return this.stagiaireService.getStagiaireQuizzes(req.user.id);
    }
};
exports.StagiaireController = StagiaireController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("profile"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)("test-auth"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "testAuth", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("dashboard/home"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "getHomeData", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("contacts"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "getContacts", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("contacts/commerciaux"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "getCommerciaux", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("contacts/formateurs"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "getFormateurs", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("contacts/pole-relation"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "getPoleRelation", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("contacts/pole-save"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "getPoleSave", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("quizzes"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "getMyQuizzes", null);
exports.StagiaireController = StagiaireController = __decorate([
    (0, common_1.Controller)("stagiaire"),
    __metadata("design:paramtypes", [stagiaire_service_1.StagiaireService])
], StagiaireController);
//# sourceMappingURL=stagiaire.controller.js.map