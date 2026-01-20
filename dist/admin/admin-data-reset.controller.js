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
exports.AdminDataResetController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const classement_entity_1 = require("../entities/classement.entity");
const progression_entity_1 = require("../entities/progression.entity");
const stagiaire_achievement_entity_1 = require("../entities/stagiaire-achievement.entity");
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
const quiz_participation_answer_entity_1 = require("../entities/quiz-participation-answer.entity");
const api_response_service_1 = require("../common/services/api-response.service");
let AdminDataResetController = class AdminDataResetController {
    constructor(classementRepository, progressionRepository, achievementRepository, participationRepository, answerRepository, apiResponse) {
        this.classementRepository = classementRepository;
        this.progressionRepository = progressionRepository;
        this.achievementRepository = achievementRepository;
        this.participationRepository = participationRepository;
        this.answerRepository = answerRepository;
        this.apiResponse = apiResponse;
    }
    async resetData(dto) {
        if (!dto.confirmation) {
            throw new common_1.HttpException("Confirmation requise pour cette action critique", common_1.HttpStatus.BAD_REQUEST);
        }
        if (!dto.dataTypes || dto.dataTypes.length === 0) {
            throw new common_1.HttpException("Veuillez sélectionner au moins un type de données à réinitialiser", common_1.HttpStatus.BAD_REQUEST);
        }
        const results = {};
        for (const dataType of dto.dataTypes) {
            switch (dataType) {
                case "classements":
                    const classementResult = await this.classementRepository.delete({});
                    results.classements = classementResult.affected || 0;
                    break;
                case "progressions":
                    const progressionResult = await this.progressionRepository.delete({});
                    results.progressions = progressionResult.affected || 0;
                    break;
                case "achievements":
                    const achievementResult = await this.achievementRepository.delete({});
                    results.achievements = achievementResult.affected || 0;
                    break;
                case "quiz_participations":
                    const answersFirst = await this.answerRepository.delete({});
                    results.quiz_answers_cascade = answersFirst.affected || 0;
                    const participationResult = await this.participationRepository.delete({});
                    results.quiz_participations = participationResult.affected || 0;
                    break;
                case "quiz_answers":
                    const answerResult = await this.answerRepository.delete({});
                    results.quiz_answers = answerResult.affected || 0;
                    break;
                case "quiz_history":
                    const historyResult = await this.progressionRepository
                        .createQueryBuilder()
                        .delete()
                        .where("quiz_id IS NOT NULL")
                        .execute();
                    results.quiz_history = historyResult.affected || 0;
                    break;
                default:
                    break;
            }
        }
        return this.apiResponse.success({
            message: "Données réinitialisées avec succès",
            deleted: results,
        });
    }
};
exports.AdminDataResetController = AdminDataResetController;
__decorate([
    (0, common_1.Post)("reset"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDataResetController.prototype, "resetData", null);
exports.AdminDataResetController = AdminDataResetController = __decorate([
    (0, common_1.Controller)("admin/data"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(classement_entity_1.Classement)),
    __param(1, (0, typeorm_1.InjectRepository)(progression_entity_1.Progression)),
    __param(2, (0, typeorm_1.InjectRepository)(stagiaire_achievement_entity_1.StagiaireAchievement)),
    __param(3, (0, typeorm_1.InjectRepository)(quiz_participation_entity_1.QuizParticipation)),
    __param(4, (0, typeorm_1.InjectRepository)(quiz_participation_answer_entity_1.QuizParticipationAnswer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], AdminDataResetController);
//# sourceMappingURL=admin-data-reset.controller.js.map