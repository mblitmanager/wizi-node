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
exports.MediaApiController = exports.MediasApiController = exports.FormationParrainageApiController = exports.CatalogueFormationsApiController = exports.FormationsApiController = exports.FormationApiController = exports.QuizApiController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const api_response_service_1 = require("../common/services/api-response.service");
let QuizApiController = class QuizApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async byFormations() {
        return this.apiResponse.success({});
    }
    async categories() {
        return this.apiResponse.success([]);
    }
    async byCategory() {
        return this.apiResponse.success([]);
    }
    async globalClassement() {
        return this.apiResponse.success([]);
    }
    async history() {
        return this.apiResponse.success([]);
    }
    async stats() {
        return this.apiResponse.success({});
    }
    async statsCategories() {
        return this.apiResponse.success({});
    }
    async statsPerformance() {
        return this.apiResponse.success({});
    }
    async statsProgress() {
        return this.apiResponse.success({});
    }
    async statsTrends() {
        return this.apiResponse.success({});
    }
    async getById(id) {
        return this.apiResponse.success({});
    }
    async submitResult(id, data) {
        return this.apiResponse.success();
    }
    async getQuestions(quizId) {
        return this.apiResponse.success([]);
    }
    async submit(quizId, data) {
        return this.apiResponse.success();
    }
    async getParticipation(quizId) {
        return this.apiResponse.success({});
    }
    async startParticipation(quizId) {
        return this.apiResponse.success();
    }
    async saveProgress(quizId, data) {
        return this.apiResponse.success();
    }
    async resumeParticipation(quizId) {
        return this.apiResponse.success({});
    }
    async complete(quizId) {
        return this.apiResponse.success();
    }
    async getStatistics(quizId) {
        return this.apiResponse.success({});
    }
    async getUserParticipations(quizId) {
        return this.apiResponse.success([]);
    }
};
exports.QuizApiController = QuizApiController;
__decorate([
    (0, common_1.Get)("by-formations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "byFormations", null);
__decorate([
    (0, common_1.Get)("categories"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "categories", null);
__decorate([
    (0, common_1.Get)("category/:categoryId"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "byCategory", null);
__decorate([
    (0, common_1.Get)("classement/global"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "globalClassement", null);
__decorate([
    (0, common_1.Get)("history"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "history", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)("stats/categories"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "statsCategories", null);
__decorate([
    (0, common_1.Get)("stats/performance"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "statsPerformance", null);
__decorate([
    (0, common_1.Get)("stats/progress"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "statsProgress", null);
__decorate([
    (0, common_1.Get)("stats/trends"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "statsTrends", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(":id/result"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "submitResult", null);
__decorate([
    (0, common_1.Get)(":quizId/questions"),
    __param(0, (0, common_1.Param)("quizId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "getQuestions", null);
__decorate([
    (0, common_1.Post)(":quizId/submit"),
    __param(0, (0, common_1.Param)("quizId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)(":quizId/participation"),
    __param(0, (0, common_1.Param)("quizId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "getParticipation", null);
__decorate([
    (0, common_1.Post)(":quizId/participation"),
    __param(0, (0, common_1.Param)("quizId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "startParticipation", null);
__decorate([
    (0, common_1.Post)(":quizId/participation/progress"),
    __param(0, (0, common_1.Param)("quizId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "saveProgress", null);
__decorate([
    (0, common_1.Get)(":quizId/participation/resume"),
    __param(0, (0, common_1.Param)("quizId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "resumeParticipation", null);
__decorate([
    (0, common_1.Post)(":quizId/complete"),
    __param(0, (0, common_1.Param)("quizId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "complete", null);
__decorate([
    (0, common_1.Get)(":quizId/statistics"),
    __param(0, (0, common_1.Param)("quizId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(":quizId/user-participations"),
    __param(0, (0, common_1.Param)("quizId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuizApiController.prototype, "getUserParticipations", null);
exports.QuizApiController = QuizApiController = __decorate([
    (0, common_1.Controller)("api/quiz"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], QuizApiController);
let FormationApiController = class FormationApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async categories() {
        return this.apiResponse.success([]);
    }
    async listFormation() {
        return this.apiResponse.success([]);
    }
};
exports.FormationApiController = FormationApiController;
__decorate([
    (0, common_1.Get)("categories"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormationApiController.prototype, "categories", null);
__decorate([
    (0, common_1.Get)("listFormation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormationApiController.prototype, "listFormation", null);
exports.FormationApiController = FormationApiController = __decorate([
    (0, common_1.Controller)("api/formation"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], FormationApiController);
let FormationsApiController = class FormationsApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async byCategory() {
        return this.apiResponse.success([]);
    }
    async classementSummary() {
        return this.apiResponse.success({});
    }
    async classement() {
        return this.apiResponse.success({});
    }
};
exports.FormationsApiController = FormationsApiController;
__decorate([
    (0, common_1.Get)("categories/:categoryId"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormationsApiController.prototype, "byCategory", null);
__decorate([
    (0, common_1.Get)("classement/summary"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormationsApiController.prototype, "classementSummary", null);
__decorate([
    (0, common_1.Get)(":formationId/classement"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormationsApiController.prototype, "classement", null);
exports.FormationsApiController = FormationsApiController = __decorate([
    (0, common_1.Controller)("api/formations"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], FormationsApiController);
let CatalogueFormationsApiController = class CatalogueFormationsApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async formations() {
        return this.apiResponse.success([]);
    }
    async getFormation() {
        return this.apiResponse.success({});
    }
    async getPdf() {
        return this.apiResponse.success();
    }
    async stagiaireFormations() {
        return this.apiResponse.success([]);
    }
    async withFormations() {
        return this.apiResponse.success([]);
    }
};
exports.CatalogueFormationsApiController = CatalogueFormationsApiController;
__decorate([
    (0, common_1.Get)("formations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogueFormationsApiController.prototype, "formations", null);
__decorate([
    (0, common_1.Get)("formations/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogueFormationsApiController.prototype, "getFormation", null);
__decorate([
    (0, common_1.Get)("formations/:id/pdf"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogueFormationsApiController.prototype, "getPdf", null);
__decorate([
    (0, common_1.Get)("stagiaire"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogueFormationsApiController.prototype, "stagiaireFormations", null);
__decorate([
    (0, common_1.Get)("with-formations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogueFormationsApiController.prototype, "withFormations", null);
exports.CatalogueFormationsApiController = CatalogueFormationsApiController = __decorate([
    (0, common_1.Controller)("api/catalogueFormations"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], CatalogueFormationsApiController);
let FormationParrainageApiController = class FormationParrainageApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async formations() {
        return this.apiResponse.success([]);
    }
};
exports.FormationParrainageApiController = FormationParrainageApiController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormationParrainageApiController.prototype, "formations", null);
exports.FormationParrainageApiController = FormationParrainageApiController = __decorate([
    (0, common_1.Controller)("api/formationParrainage"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], FormationParrainageApiController);
let MediasApiController = class MediasApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async astuces() {
        return this.apiResponse.success([]);
    }
    async tutoriels() {
        return this.apiResponse.success([]);
    }
    async formationsWithStatus() {
        return this.apiResponse.success([]);
    }
    async interactiveFormations() {
        return this.apiResponse.success([]);
    }
    async astucesByFormation() {
        return this.apiResponse.success([]);
    }
    async tutorielsByFormation() {
        return this.apiResponse.success([]);
    }
    async serverVideos() {
        return this.apiResponse.success([]);
    }
    async uploadVideo(data) {
        return this.apiResponse.success();
    }
    async markAsWatched() {
        return this.apiResponse.success();
    }
};
exports.MediasApiController = MediasApiController;
__decorate([
    (0, common_1.Get)("astuces"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediasApiController.prototype, "astuces", null);
__decorate([
    (0, common_1.Get)("tutoriels"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediasApiController.prototype, "tutoriels", null);
__decorate([
    (0, common_1.Get)("formations-with-status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediasApiController.prototype, "formationsWithStatus", null);
__decorate([
    (0, common_1.Get)("formations/interactives"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediasApiController.prototype, "interactiveFormations", null);
__decorate([
    (0, common_1.Get)("formations/:formationId/astuces"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediasApiController.prototype, "astucesByFormation", null);
__decorate([
    (0, common_1.Get)("formations/:formationId/tutoriels"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediasApiController.prototype, "tutorielsByFormation", null);
__decorate([
    (0, common_1.Get)("server"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediasApiController.prototype, "serverVideos", null);
__decorate([
    (0, common_1.Post)("upload-video"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MediasApiController.prototype, "uploadVideo", null);
__decorate([
    (0, common_1.Post)(":mediaId/watched"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediasApiController.prototype, "markAsWatched", null);
exports.MediasApiController = MediasApiController = __decorate([
    (0, common_1.Controller)("api/medias"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], MediasApiController);
let MediaApiController = class MediaApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async stream() {
        return this.apiResponse.success();
    }
    async subtitle() {
        return this.apiResponse.success();
    }
};
exports.MediaApiController = MediaApiController;
__decorate([
    (0, common_1.Get)("stream/:path"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaApiController.prototype, "stream", null);
__decorate([
    (0, common_1.Get)("subtitle/:path"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaApiController.prototype, "subtitle", null);
exports.MediaApiController = MediaApiController = __decorate([
    (0, common_1.Controller)("api/media"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], MediaApiController);
//# sourceMappingURL=quiz-api.controller.js.map