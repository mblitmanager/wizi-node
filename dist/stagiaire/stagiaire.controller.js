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
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const stagiaire_service_1 = require("./stagiaire.service");
const inscription_service_1 = require("../inscription/inscription.service");
const ranking_service_1 = require("../ranking/ranking.service");
let StagiaireController = class StagiaireController {
    constructor(stagiaireService, inscriptionService, rankingService) {
        this.stagiaireService = stagiaireService;
        this.inscriptionService = inscriptionService;
        this.rankingService = rankingService;
    }
    async getProgress(req) {
        return this.rankingService.getMyRanking(req.user.id);
    }
    async getProfile(req) {
        try {
            return await this.stagiaireService.getDetailedProfile(req.user.id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
            const data = await this.stagiaireService.getContacts(req.user.id);
            return data;
        }
        catch (error) {
            console.error("Error in getContacts:", error);
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCommerciaux(req) {
        try {
            const contacts = await this.stagiaireService.getContactsByType(req.user.id, "commercial");
            return contacts;
        }
        catch (error) {
            console.error("Error in getCommerciaux:", error);
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getFormateurs(req) {
        try {
            const contacts = await this.stagiaireService.getContactsByType(req.user.id, "formateur");
            return contacts;
        }
        catch (error) {
            console.error("Error in getFormateurs:", error);
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPoleRelation(req) {
        try {
            const contacts = await this.stagiaireService.getContactsByType(req.user.id, "pole-relation");
            return contacts;
        }
        catch (error) {
            console.error("Error in getPoleRelation:", error);
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPoleSave(req) {
        try {
            const contacts = await this.stagiaireService.getContactsByType(req.user.id, "pole-save");
            return contacts;
        }
        catch (error) {
            console.error("Error in getPoleSave:", error);
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMyQuizzes(req) {
        return this.stagiaireService.getStagiaireQuizzes(req.user.id);
    }
    async getStagiaireFormations(id) {
        try {
            return await this.stagiaireService.getFormationsByStagiaire(id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async inscrireAFormation(req, catalogueFormationId) {
        try {
            return await this.inscriptionService.inscrire(req.user.id, catalogueFormationId);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMyPartner(req) {
        try {
            return await this.stagiaireService.getMyPartner(req.user.id);
        }
        catch (error) {
            console.error("Error in getMyPartner:", error);
            throw new common_1.HttpException(error.message || "Internal error", error instanceof common_1.NotFoundException
                ? common_1.HttpStatus.NOT_FOUND
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePassword(req, data) {
        try {
            const success = await this.stagiaireService.updatePassword(req.user.id, data);
            return { success };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async setOnboardingSeen(req) {
        try {
            const success = await this.stagiaireService.setOnboardingSeen(req.user.id);
            return { success };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getOnlineUsers() {
        try {
            return await this.stagiaireService.getOnlineUsers();
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async uploadProfilePhoto(req, file) {
        if (!file) {
            throw new common_1.HttpException("No file uploaded", common_1.HttpStatus.BAD_REQUEST);
        }
        const photoPath = `uploads/users/${file.filename}`;
        try {
            await this.stagiaireService.updateProfilePhoto(req.user.id, photoPath);
            return {
                success: true,
                image: photoPath,
                image_url: `/${photoPath}`,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.StagiaireController = StagiaireController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("progress"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "getProgress", null);
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
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)(":id/formations"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "getStagiaireFormations", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Post)("inscription-catalogue-formation"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)("catalogue_formation_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "inscrireAFormation", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("partner"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "getMyPartner", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Post)("update-password"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Post)("onboarding-seen"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "setOnboardingSeen", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("online-users"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "getOnlineUsers", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Post)("profile-photo"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("avatar", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/uploads/users",
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join("");
                return cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StagiaireController.prototype, "uploadProfilePhoto", null);
exports.StagiaireController = StagiaireController = __decorate([
    (0, common_1.Controller)("stagiaire"),
    __metadata("design:paramtypes", [stagiaire_service_1.StagiaireService,
        inscription_service_1.InscriptionService,
        ranking_service_1.RankingService])
], StagiaireController);
//# sourceMappingURL=stagiaire.controller.js.map