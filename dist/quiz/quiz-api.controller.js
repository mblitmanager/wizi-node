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
exports.QuizApiController = void 0;
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
        return this.apiResponse.success([]);
    }
    async statsPerformance() {
        return this.apiResponse.success({
            strengths: [],
            weaknesses: [],
            improvement_areas: [],
        });
    }
    async statsProgress() {
        return this.apiResponse.success({
            daily_progress: [],
            weekly_progress: [],
            monthly_progress: [],
        });
    }
    async statsTrends() {
        return this.apiResponse.success({
            category_trends: [],
            overall_trend: [],
        });
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
//# sourceMappingURL=quiz-api.controller.js.map