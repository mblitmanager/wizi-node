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
exports.AchievementController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const achievement_service_1 = require("./achievement.service");
let AchievementController = class AchievementController {
    constructor(achievementService) {
        this.achievementService = achievementService;
    }
    async getAchievements(req) {
        const achievements = await this.achievementService.getAchievements(req.user.stagiaire?.id);
        return { achievements };
    }
    async getAllAchievements() {
        const achievements = await this.achievementService.getAllAchievements();
        return { achievements };
    }
    async checkAchievements(req, code, quizId) {
        let newAchievements = [];
        if (code) {
            newAchievements = await this.achievementService.unlockAchievementByCode(req.user.stagiaire?.id, code);
        }
        else {
            newAchievements = await this.achievementService.checkAchievements(req.user.stagiaire?.id, quizId);
        }
        return { new_achievements: newAchievements };
    }
};
exports.AchievementController = AchievementController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AchievementController.prototype, "getAchievements", null);
__decorate([
    (0, common_1.Get)("all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AchievementController.prototype, "getAllAchievements", null);
__decorate([
    (0, common_1.Post)("check"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)("code")),
    __param(2, (0, common_1.Body)("quiz_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], AchievementController.prototype, "checkAchievements", null);
exports.AchievementController = AchievementController = __decorate([
    (0, common_1.Controller)("stagiaire/achievements"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [achievement_service_1.AchievementService])
], AchievementController);
//# sourceMappingURL=achievement.controller.js.map