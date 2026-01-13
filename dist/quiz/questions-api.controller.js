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
exports.QuestionsApiController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_service_1 = require("../common/services/api-response.service");
const quiz_service_1 = require("./quiz.service");
const question_entity_1 = require("../entities/question.entity");
const reponse_entity_1 = require("../entities/reponse.entity");
let QuestionsApiController = class QuestionsApiController {
    constructor(quizService, apiResponse, questionRepository, reponseRepository) {
        this.quizService = quizService;
        this.apiResponse = apiResponse;
        this.questionRepository = questionRepository;
        this.reponseRepository = reponseRepository;
    }
    async getAll(page = 1, limit = 30) {
        const pageNum = typeof page === "string" ? parseInt(page, 10) : page || 1;
        const limitNum = typeof limit === "string" ? parseInt(limit, 10) : limit || 30;
        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await this.questionRepository.findAndCount({
            skip,
            take: limitNum,
            relations: ["reponses", "quiz"],
            order: { id: "DESC" },
        });
        const members = data.map((q) => this.quizService.formatQuestionJsonLd(q));
        return {
            "@context": "/api/contexts/Questions",
            "@id": "/api/questions",
            "@type": "Questions",
            totalItems: total,
            member: members,
        };
    }
    async create(createQuestionDto) {
        const question = this.questionRepository.create({
            text: createQuestionDto.texte || createQuestionDto.text,
            quiz_id: createQuestionDto.quiz_id,
            type: createQuestionDto.type || "choix multiples",
            points: createQuestionDto.points || "1",
            astuce: createQuestionDto.astuce || createQuestionDto.hint,
            explication: createQuestionDto.explication || createQuestionDto.explanation,
            audio_url: createQuestionDto.audio_url,
            media_url: createQuestionDto.media_url || createQuestionDto.image_url,
        });
        const saved = await this.questionRepository.save(question);
        const result = await this.questionRepository.findOne({
            where: { id: saved.id },
            relations: ["reponses", "quiz"],
        });
        return this.quizService.formatQuestionJsonLd(result);
    }
    async getById(id) {
        const question = await this.questionRepository.findOne({
            where: { id },
            relations: ["reponses", "quiz"],
        });
        if (!question) {
            throw new common_1.NotFoundException("Question non trouvée");
        }
        return this.quizService.formatQuestionJsonLd(question);
    }
    async update(id, updateQuestionDto) {
        const question = await this.questionRepository.findOne({
            where: { id },
            relations: ["reponses", "quiz"],
        });
        if (!question) {
            throw new common_1.NotFoundException("Question non trouvée");
        }
        Object.assign(question, {
            text: updateQuestionDto.texte ?? updateQuestionDto.text ?? question.text,
            type: updateQuestionDto.type ?? question.type,
            points: updateQuestionDto.points ?? question.points,
            astuce: updateQuestionDto.astuce ?? updateQuestionDto.hint ?? question.astuce,
            explication: updateQuestionDto.explication ??
                updateQuestionDto.explanation ??
                question.explication,
            audio_url: updateQuestionDto.audio_url ?? question.audio_url,
            media_url: updateQuestionDto.media_url ??
                updateQuestionDto.image_url ??
                question.media_url,
        });
        await this.questionRepository.save(question);
        const updated = await this.questionRepository.findOne({
            where: { id },
            relations: ["reponses", "quiz"],
        });
        return this.quizService.formatQuestionJsonLd(updated);
    }
    async delete(id) {
        const question = await this.questionRepository.findOne({
            where: { id },
        });
        if (!question) {
            throw new common_1.NotFoundException("Question non trouvée");
        }
        await this.questionRepository.remove(question);
        return { id, message: "Question supprimée avec succès" };
    }
    async getReponsesByQuestion(questionId) {
        const question = await this.questionRepository.findOne({
            where: { id: questionId },
            relations: ["reponses"],
        });
        if (!question) {
            throw new common_1.NotFoundException("Question non trouvée");
        }
        return question.reponses.map((r) => this.quizService.formatReponseJsonLd(r));
    }
};
exports.QuestionsApiController = QuestionsApiController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], QuestionsApiController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuestionsApiController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuestionsApiController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], QuestionsApiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuestionsApiController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(":questionId/reponses"),
    __param(0, (0, common_1.Param)("questionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuestionsApiController.prototype, "getReponsesByQuestion", null);
exports.QuestionsApiController = QuestionsApiController = __decorate([
    (0, common_1.Controller)("questions"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(2, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(3, (0, typeorm_1.InjectRepository)(reponse_entity_1.Reponse)),
    __metadata("design:paramtypes", [quiz_service_1.QuizService,
        api_response_service_1.ApiResponseService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuestionsApiController);
//# sourceMappingURL=questions-api.controller.js.map