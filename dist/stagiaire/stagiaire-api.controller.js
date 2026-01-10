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
const inscription_service_1 = require("../inscription/inscription.service");
let StagiaireApiController = class StagiaireApiController {
    constructor(inscriptionService) {
        this.inscriptionService = inscriptionService;
    }
    async profile(req) {
        return { user: req.user, message: "User profile" };
    }
    async updateProfile(req, data) {
        return { user: req.user, message: "Profile updated" };
    }
    async patchProfile(req, data) {
        return { user: req.user, message: "Profile updated" };
    }
    async uploadProfilePhoto(req, data) {
        return { message: "Photo uploaded" };
    }
    async show(req) {
        return { user: req.user };
    }
    async dashboardHome(req) {
        return { message: "Dashboard home", user: req.user };
    }
    async formations(req) {
        return { data: [], message: "My formations" };
    }
    async formationClassement() {
        return { data: [], message: "Formation ranking" };
    }
    async inscriptionCatalogueFormation(req, data) {
        return this.inscriptionService.inscrire(req.user.id, data.catalogue_formation_id);
    }
    async onboardingSeen(req) {
        return { message: "Onboarding marked as seen" };
    }
    async achievements(req) {
        return { data: [], message: "My achievements" };
    }
    async allAchievements() {
        return { data: [], message: "All achievements" };
    }
    async checkAchievements() {
        return { message: "Achievements checked" };
    }
    async contacts() {
        return { data: [], message: "My contacts" };
    }
    async contactsCommerciaux() {
        return { data: [], message: "Commercial contacts" };
    }
    async contactsFormateurs() {
        return { data: [], message: "Formateur contacts" };
    }
    async contactsPoleRelation() {
        return { data: [], message: "Pole relation contacts" };
    }
    async contactsPoleSave() {
        return { data: [], message: "Pole save contacts" };
    }
    async progress() {
        return { data: {}, message: "My progress" };
    }
    async quizzes() {
        return { data: [], message: "My quizzes" };
    }
    async rankingGlobal() {
        return { data: [], message: "Global ranking" };
    }
    async rankingFormation() {
        return { data: [], message: "Formation ranking" };
    }
    async rewards() {
        return { data: [], message: "My rewards" };
    }
    async partner() {
        return { data: {}, message: "My partner" };
    }
    async parainageStats() {
        return { data: {}, message: "Parrainage stats" };
    }
    async parainageHistory() {
        return { data: [], message: "Parrainage history" };
    }
    async parainageFilleuls() {
        return { data: [], message: "My filleuls" };
    }
    async parainageRewards() {
        return { data: [], message: "Parrainage rewards" };
    }
    async parainageAccept(data) {
        return { message: "Parrainage accepted" };
    }
    async userFormations(id) {
        return { data: [], message: "User formations" };
    }
    async userCatalogueFormations(id) {
        return { data: [], message: "User catalogue formations" };
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "progress", null);
__decorate([
    (0, common_1.Get)("quizzes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "quizzes", null);
__decorate([
    (0, common_1.Get)("ranking/global"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "rankingGlobal", null);
__decorate([
    (0, common_1.Get)("ranking/formation/:formationId"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StagiaireApiController.prototype, "rankingFormation", null);
__decorate([
    (0, common_1.Get)("rewards"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
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
    (0, common_1.Controller)("api/stagiaire"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [inscription_service_1.InscriptionService])
], StagiaireApiController);
let ApiGeneralController = class ApiGeneralController {
    constructor() { }
    async getUser(req) {
        return { user: req.user };
    }
    async getMe(req) {
        return { user: req.user };
    }
    async getUserSettings(req) {
        return { settings: {}, user: req.user };
    }
    async updateUserSettings(req, data) {
        return { settings: data, message: "Settings updated" };
    }
    async reportUserAppUsage(req, data) {
        return { message: "Usage reported" };
    }
    async updateUserPhoto(req, data) {
        return { message: "Photo updated" };
    }
    async getUserPoints(req) {
        return { points: 0, user: req.user };
    }
    async updateFcmToken(req, token) {
        return { message: "FCM token updated" };
    }
};
exports.ApiGeneralController = ApiGeneralController;
__decorate([
    (0, common_1.Get)("user"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGeneralController.prototype, "getUser", null);
__decorate([
    (0, common_1.Get)("me"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGeneralController.prototype, "getMe", null);
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
    (0, common_1.Post)("fcm-token"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ApiGeneralController.prototype, "updateFcmToken", null);
exports.ApiGeneralController = ApiGeneralController = __decorate([
    (0, common_1.Controller)("api"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [])
], ApiGeneralController);
//# sourceMappingURL=stagiaire-api.controller.js.map