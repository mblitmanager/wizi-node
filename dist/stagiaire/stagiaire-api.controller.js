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
exports.ApiGeneralController = exports.StagiaireApiController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const inscription_service_1 = require("../inscription/inscription.service");
const ranking_service_1 = require("../ranking/ranking.service");
const stagiaire_service_1 = require("./stagiaire.service");
const api_response_service_1 = require("../common/services/api-response.service");
const s3_storage_service_1 = require("../common/services/s3-storage.service");
let StagiaireApiController = class StagiaireApiController {
    constructor(inscriptionService, rankingService, stagiaireService, apiResponse, s3Storage) {
        this.inscriptionService = inscriptionService;
        this.rankingService = rankingService;
        this.stagiaireService = stagiaireService;
        this.apiResponse = apiResponse;
        this.s3Storage = s3Storage;
    }
    async profile(req) {
        const data = await this.stagiaireService.getDetailedProfile(req.user.id);
        return this.apiResponse.success(data);
    }
    async updateProfile(req, data) {
        return this.apiResponse.success(req.user);
    }
    async patchProfile(req, data) {
        return this.apiResponse.success(req.user);
    }
    async uploadProfilePhoto(req, data) {
        return this.apiResponse.success();
    }
    async show(req) {
        const userId = req.user.id;
        const data = await this.stagiaireService.getShowData(userId);
        return this.apiResponse.success(data);
    }
    async dashboardHome(req) {
        return this.apiResponse.success(req.user);
    }
    async formations(req) {
        return this.apiResponse.success([]);
    }
    async formationClassement(formationId) {
        const data = await this.rankingService.getFormationRanking(formationId);
        return this.apiResponse.success(data);
    }
    async inscriptionCatalogueFormation(req, data) {
        try {
            if (!data.catalogue_formation_id) {
                return this.apiResponse.error("Le champ catalogue_formation_id est requis.", 400);
            }
            return await this.inscriptionService.inscrire(req.user.id, data.catalogue_formation_id);
        }
        catch (error) {
            console.error("Erreur lors de l'inscription:", error);
            return this.apiResponse.error(error.message || "Une erreur est survenue lors de l'inscription.", 500);
        }
    }
    async onboardingSeen(req) {
        return this.apiResponse.success();
    }
    async achievements(req) {
        return this.apiResponse.success([]);
    }
    async allAchievements() {
        return this.apiResponse.success([]);
    }
    async checkAchievements() {
        return this.apiResponse.success();
    }
    async contacts() {
        return this.apiResponse.success([]);
    }
    async contactsCommerciaux() {
        return this.apiResponse.success([]);
    }
    async contactsFormateurs() {
        return this.apiResponse.success([]);
    }
    async contactsPoleRelation() {
        return this.apiResponse.success([]);
    }
    async contactsPoleSave() {
        return this.apiResponse.success([]);
    }
    async progress(req) {
        const data = await this.rankingService.getStagiaireProgress(req.user.id);
        return this.apiResponse.success(data);
    }
    async quizzes(req) {
        const userId = req.user?.id || 7;
        return {
            data: await this.rankingService.getQuizHistory(userId),
        };
    }
    async rankingGlobal(period = "all") {
        const data = await this.rankingService.getGlobalRanking(period);
        return this.apiResponse.success(data);
    }
    async rankingFormation(formationId, period = "all") {
        const data = await this.rankingService.getFormationRanking(formationId, period);
        return this.apiResponse.success(data);
    }
    async rewards(req) {
        const userId = req.user?.id || 7;
        const data = await this.rankingService.getStagiaireRewards(userId);
        return this.apiResponse.success(data);
    }
    async partner() {
        return this.apiResponse.success({});
    }
    async parainageStats() {
        return this.apiResponse.success({});
    }
    async parainageHistory() {
        return this.apiResponse.success([]);
    }
    async parainageFilleuls() {
        return this.apiResponse.success([]);
    }
    async parainageRewards() {
        return this.apiResponse.success([]);
    }
    async parainageAccept(data) {
        return this.apiResponse.success();
    }
    async userFormations(id) {
        return this.apiResponse.success([]);
    }
    async userCatalogueFormations(id) {
        const response = await this.stagiaireService.getFormationsByStagiaire(id);
        return response.data;
    }
};
exports.StagiaireApiController = StagiaireApiController;
__decorate([
    (0, common_1.Get)("profile"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "profile", null);
__decorate([
    (0, common_1.Put)("profile"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)("profile"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "patchProfile", null);
__decorate([
    (0, common_1.Post)("profile/photo"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "uploadProfilePhoto", null);
__decorate([
    (0, common_1.Get)("show"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "show", null);
__decorate([
    (0, common_1.Get)("dashboard/home"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "dashboardHome", null);
__decorate([
    (0, common_1.Get)("formations"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "formations", null);
__decorate([
    (0, common_1.Get)("formations/:formationId/classement"),
    __param(0, (0, common_1.Param)("formationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "formationClassement", null);
__decorate([
    (0, common_1.Post)("inscription-catalogue-formation"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "inscriptionCatalogueFormation", null);
__decorate([
    (0, common_1.Post)("onboarding-seen"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "onboardingSeen", null);
__decorate([
    (0, common_1.Get)("achievements"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "achievements", null);
__decorate([
    (0, common_1.Get)("achievements/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "allAchievements", null);
__decorate([
    (0, common_1.Post)("achievements/check"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "checkAchievements", null);
__decorate([
    (0, common_1.Get)("contacts"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "contacts", null);
__decorate([
    (0, common_1.Get)("contacts/commerciaux"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "contactsCommerciaux", null);
__decorate([
    (0, common_1.Get)("contacts/formateurs"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "contactsFormateurs", null);
__decorate([
    (0, common_1.Get)("contacts/pole-relation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "contactsPoleRelation", null);
__decorate([
    (0, common_1.Get)("contacts/pole-save"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "contactsPoleSave", null);
__decorate([
    (0, common_1.Get)("progress"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "progress", null);
__decorate([
    (0, common_1.Get)("quizzes"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "quizzes", null);
__decorate([
    (0, common_1.Get)("ranking/global"),
    __param(0, (0, common_1.Query)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "rankingGlobal", null);
__decorate([
    (0, common_1.Get)("ranking/formation/:formationId"),
    __param(0, (0, common_1.Param)("formationId")),
    __param(1, (0, common_1.Query)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "rankingFormation", null);
__decorate([
    (0, common_1.Get)("rewards"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "rewards", null);
__decorate([
    (0, common_1.Get)("partner"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "partner", null);
__decorate([
    (0, common_1.Get)("parrainage/stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "parainageStats", null);
__decorate([
    (0, common_1.Get)("parrainage/history"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "parainageHistory", null);
__decorate([
    (0, common_1.Get)("parrainage/filleuls"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "parainageFilleuls", null);
__decorate([
    (0, common_1.Get)("parrainage/rewards"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "parainageRewards", null);
__decorate([
    (0, common_1.Post)("parrainage/accept"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "parainageAccept", null);
__decorate([
    (0, common_1.Get)(":id/formations"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "userFormations", null);
__decorate([
    (0, common_1.Get)(":id/catalogueFormations"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "userCatalogueFormations", null);
exports.StagiaireApiController = StagiaireApiController = __decorate([
    (0, common_1.Controller)("stagiaire"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [inscription_service_1.InscriptionService,
        ranking_service_1.RankingService,
        stagiaire_service_1.StagiaireService,
        api_response_service_1.ApiResponseService,
        s3_storage_service_1.S3StorageService])
], StagiaireApiController);
let ApiGeneralController = class ApiGeneralController {
    constructor(rankingService, stagiaireService, apiResponse, s3Storage) {
        this.rankingService = rankingService;
        this.stagiaireService = stagiaireService;
        this.apiResponse = apiResponse;
        this.s3Storage = s3Storage;
    }
    async getUserSettings(req) {
        return this.apiResponse.success({});
    }
    async updateUserSettings(req, data) {
        return this.apiResponse.success(data);
    }
    async reportUserAppUsage(req, data) {
        return this.apiResponse.success();
    }
    async updateUserPhoto(req, data) {
        return this.apiResponse.success();
    }
    async getUserPoints(req) {
        const data = await this.rankingService.getUserPoints(req.user.id);
        return this.apiResponse.success(data);
    }
    async updateAvatar(id, file, req) {
        if (!file) {
            return this.apiResponse.error("No image uploaded", 400);
        }
        const result = await this.s3Storage.uploadFile(file, "users");
        await this.stagiaireService.updateProfilePhoto(req.user.id, result.key);
        return this.apiResponse.success({
            message: "Avatar mis à jour",
            avatar: result.key,
            avatar_url: result.url,
        });
    }
    async getUserStatus() {
        const data = await this.stagiaireService.getOnlineUsers();
        return data;
    }
    async updateFcmToken(req, token) {
        return this.apiResponse.success();
    }
};
exports.ApiGeneralController = ApiGeneralController;
__decorate([
    (0, common_1.Get)("user/settings"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGeneralController.prototype, "getUserSettings", null);
__decorate([
    (0, common_1.Put)("user/settings"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGeneralController.prototype, "updateUserSettings", null);
__decorate([
    (0, common_1.Post)("user-app-usage"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGeneralController.prototype, "reportUserAppUsage", null);
__decorate([
    (0, common_1.Post)("user/photo"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGeneralController.prototype, "updateUserPhoto", null);
__decorate([
    (0, common_1.Get)("users/me/points"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGeneralController.prototype, "getUserPoints", null);
__decorate([
    (0, common_1.Post)("avatar/:id/update-profile"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("image", {
        storage: (0, multer_1.memoryStorage)(),
    })),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGeneralController.prototype, "updateAvatar", null);
__decorate([
    (0, common_1.Get)("user-status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiGeneralController.prototype, "getUserStatus", null);
__decorate([
    (0, common_1.Post)("fcm-token"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ApiGeneralController.prototype, "updateFcmToken", null);
exports.ApiGeneralController = ApiGeneralController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [ranking_service_1.RankingService,
        stagiaire_service_1.StagiaireService,
        api_response_service_1.ApiResponseService,
        s3_storage_service_1.S3StorageService])
], ApiGeneralController);
//# sourceMappingURL=stagiaire-api.controller.js.map