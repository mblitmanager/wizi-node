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
const question_entity_1 = require("../entities/question.entity");
const reponse_entity_1 = require("../entities/reponse.entity");
let QuestionsApiController = class QuestionsApiController {
    constructor(apiResponse, questionRepository, reponseRepository) {
        this.apiResponse = apiResponse;
        this.questionRepository = questionRepository;
        this.reponseRepository = reponseRepository;
    }
    async getAll(page = 1, limit = 30) {
        const skip = (page - 1) * limit;
        const [data, total] = await this.questionRepository.findAndCount({
            skip,
            take: limit,
            relations: ["reponses", "quiz"],
            order: { id: "DESC" },
        });
        return this.apiResponse.success({
            data: data.map(q => this.formatQuestion(q)),
            pagination: {
                current_page: page,
                per_page: limit,
                total,
                last_page: Math.ceil(total / limit),
            },
        });
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
        return this.apiResponse.success(this.formatQuestion(result), "Question créée avec succès", 201);
    }
    async getById(id) {
        const question = await this.questionRepository.findOne({
            where: { id },
            relations: ["reponses", "quiz"],
        });
        if (!question) {
            throw new common_1.NotFoundException("Question non trouvée");
        }
        return this.apiResponse.success(this.formatQuestion(question));
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
            explication: updateQuestionDto.explication ?? updateQuestionDto.explanation ?? question.explication,
            audio_url: updateQuestionDto.audio_url ?? question.audio_url,
            media_url: updateQuestionDto.media_url ?? updateQuestionDto.image_url ?? question.media_url,
        });
        await this.questionRepository.save(question);
        const updated = await this.questionRepository.findOne({
            where: { id },
            relations: ["reponses", "quiz"],
        });
        return this.apiResponse.success(this.formatQuestion(updated), "Question mise à jour");
    }
    async delete(id) {
        const question = await this.questionRepository.findOne({
            where: { id },
        });
        if (!question) {
            throw new common_1.NotFoundException("Question non trouvée");
        }
        await this.questionRepository.remove(question);
        return this.apiResponse.success({ id }, "Question supprimée avec succès");
    }
    async getReponsesByQuestion(questionId) {
        const question = await this.questionRepository.findOne({
            where: { id: questionId },
            relations: ["reponses"],
        });
        if (!question) {
            throw new common_1.NotFoundException("Question non trouvée");
        }
        return this.apiResponse.success(question.reponses.map(r => this.formatReponse(r)));
    }
    formatQuestion(question) {
        return {
            "@context": "/api/contexts/Question",
            "@id": `/api/questions/${question.id}`,
            "@type": "Question",
            id: question.id,
            texte: question.text,
            type: question.type || "choix multiples",
            points: question.points || "1",
            astuce: question.astuce,
            explication: question.explication,
            audio_url: question.audio_url,
            media_url: question.media_url,
            flashcard_back: question.flashcard_back,
            quiz: question.quiz ? `/api/quizzes/${question.quiz.id}` : null,
            reponses: question.reponses
                ? question.reponses.map(r => `/api/reponses/${r.id}`)
                : [],
            created_at: question.created_at,
            updated_at: question.updated_at,
        };
    }
    formatReponse(reponse) {
        return {
            "@id": `/api/reponses/${reponse.id}`,
            id: reponse.id,
            texte: reponse.text,
            correct: reponse.isCorrect || false,
            position: reponse.position,
            explanation: reponse.flashcardBack,
            question: `/api/questions/${reponse.question_id}`,
            created_at: reponse.created_at,
        };
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
    __param(1, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(2, (0, typeorm_1.InjectRepository)(reponse_entity_1.Reponse)),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuestionsApiController);
//# sourceMappingURL=questions-api.controller.js.map