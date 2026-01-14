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
exports.RankingController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const ranking_service_1 = require("./ranking.service");
let RankingController = class RankingController {
    constructor(rankingService) {
        this.rankingService = rankingService;
    }
    async getFormationsRankingSummary(period = "all") {
        return this.rankingService.getFormationsRankingSummary(period);
    }
    async getGlobalRanking(period = "all") {
        const data = await this.rankingService.getGlobalRanking(period);
        return data.map(({ level, ...item }) => item);
    }
    async getMyRanking(req) {
        return this.rankingService.getMyRanking(req.user.id);
    }
    async getMyPoints(req) {
        const points = await this.rankingService.getUserPoints(req.user.id);
        return points;
    }
    async getFormationRanking(formationId, period = "all") {
        return this.rankingService.getFormationRanking(formationId, period);
    }
    async getMyRewards(req) {
        return this.rankingService.getStagiaireRewards(req.user.id);
    }
    async getMyProgress(req) {
        return this.rankingService.getStagiaireProgress(req.user.id);
    }
    async getStagiaireDetails(stagiaireId) {
        return this.rankingService.getStagiaireDetails(stagiaireId);
    }
};
exports.RankingController = RankingController;
__decorate([
    (0, common_1.Get)("summary"),
    __param(0, (0, common_1.Query)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RankingController.prototype, "getFormationsRankingSummary", null);
__decorate([
    (0, common_1.Get)("global"),
    __param(0, (0, common_1.Query)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RankingController.prototype, "getGlobalRanking", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("me"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RankingController.prototype, "getMyRanking", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("points"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RankingController.prototype, "getMyPoints", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("formation/:formationId"),
    __param(0, (0, common_1.Param)("formationId")),
    __param(1, (0, common_1.Query)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], RankingController.prototype, "getFormationRanking", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("rewards"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RankingController.prototype, "getMyRewards", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("progress"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RankingController.prototype, "getMyProgress", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("details/:stagiaireId"),
    __param(0, (0, common_1.Param)("stagiaireId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RankingController.prototype, "getStagiaireDetails", null);
exports.RankingController = RankingController = __decorate([
    (0, common_1.Controller)(["classement", "quiz/classement", "formations/classement"]),
    __metadata("design:paramtypes", [ranking_service_1.RankingService])
], RankingController);
//# sourceMappingURL=ranking.controller.js.map