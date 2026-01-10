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
let QuizApiController = class QuizApiController {
    constructor() { }
    async byFormations() {
        return { data: {}, message: "Quizzes grouped by formations" };
    }
    async categories() {
        return { data: [], message: "Quiz categories" };
    }
    async byCategory() {
        return { data: [], message: "Quizzes by category" };
    }
    async globalClassement() {
        return { data: [], message: "Global quiz ranking" };
    }
    async history() {
        return { data: [], message: "Quiz history" };
    }
    async stats() {
        return { data: {}, message: "Quiz statistics" };
    }
    async statsCategories() {
        return { data: {}, message: "Category statistics" };
    }
    async statsPerformance() {
        return { data: {}, message: "Performance statistics" };
    }
    async statsProgress() {
        return { data: {}, message: "Progress statistics" };
    }
    async statsTrends() {
        return { data: {}, message: "Trends statistics" };
    }
    async getById(id) {
        return { data: {}, message: "Quiz details" };
    }
    async submitResult(id, data) {
        return { message: "Result submitted" };
    }
    async getQuestions(quizId) {
        return { data: [], message: "Quiz questions" };
    }
    async submit(quizId, data) {
        return { message: "Quiz submitted" };
    }
    async getParticipation(quizId) {
        return { data: {}, message: "Current participation" };
    }
    async startParticipation(quizId) {
        return { message: "Participation started" };
    }
    async saveProgress(quizId, data) {
        return { message: "Progress saved" };
    }
    async resumeParticipation(quizId) {
        return { data: {}, message: "Resume participation" };
    }
    async complete(quizId) {
        return { message: "Quiz completed" };
    }
    async getStatistics(quizId) {
        return { data: {}, message: "Quiz statistics" };
    }
    async getUserParticipations(quizId) {
        return { data: [], message: "User participations" };
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
    __metadata("design:paramtypes", [])
], QuizApiController);
let FormationApiController = class FormationApiController {
    constructor() { }
    async categories() {
        return { data: [], message: "Formation categories" };
    }
    async listFormation() {
        return { data: [], message: "All formations" };
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
    __metadata("design:paramtypes", [])
], FormationApiController);
let FormationsApiController = class FormationsApiController {
    constructor() { }
    async byCategory() {
        return { data: [], message: "Formations by category" };
    }
    async classementSummary() {
        return { data: {}, message: "Classement summary" };
    }
    async classement() {
        return { data: {}, message: "Formation classement" };
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
    __metadata("design:paramtypes", [])
], FormationsApiController);
let CatalogueFormationsApiController = class CatalogueFormationsApiController {
    constructor() { }
    async formations() {
        return { data: [], message: "All catalogue formations" };
    }
    async getFormation() {
        return { data: {}, message: "Catalogue formation details" };
    }
    async getPdf() {
        return { message: "PDF download" };
    }
    async stagiaireFormations() {
        return { data: [], message: "Stagiaire catalogue formations" };
    }
    async withFormations() {
        return { data: [], message: "Catalogues with formations" };
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
    __metadata("design:paramtypes", [])
], CatalogueFormationsApiController);
let FormationParrainageApiController = class FormationParrainageApiController {
    constructor() { }
    async formations() {
        return { data: [], message: "Formation parrainage" };
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
    __metadata("design:paramtypes", [])
], FormationParrainageApiController);
let MediasApiController = class MediasApiController {
    constructor() { }
    async astuces() {
        return { data: [], message: "Astuces" };
    }
    async tutoriels() {
        return { data: [], message: "Tutoriels" };
    }
    async formationsWithStatus() {
        return { data: [], message: "Formations with watched status" };
    }
    async interactiveFormations() {
        return { data: [], message: "Interactive formations" };
    }
    async astucesByFormation() {
        return { data: [], message: "Astuces by formation" };
    }
    async tutorielsByFormation() {
        return { data: [], message: "Tutoriels by formation" };
    }
    async serverVideos() {
        return { data: [], message: "Server videos" };
    }
    async uploadVideo(data) {
        return { message: "Video uploaded" };
    }
    async markAsWatched() {
        return { message: "Marked as watched" };
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
    __metadata("design:paramtypes", [])
], MediasApiController);
let MediaApiController = class MediaApiController {
    constructor() { }
    async stream() {
        return { message: "Stream video" };
    }
    async subtitle() {
        return { message: "Stream subtitle" };
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
    __metadata("design:paramtypes", [])
], MediaApiController);
//# sourceMappingURL=quiz-api.controller.js.map