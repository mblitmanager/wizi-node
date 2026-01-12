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
exports.ReponseApiController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_service_1 = require("../common/services/api-response.service");
const quiz_service_1 = require("./quiz.service");
const reponse_entity_1 = require("../entities/reponse.entity");
const question_entity_1 = require("../entities/question.entity");
let ReponseApiController = class ReponseApiController {
    constructor(quizService, apiResponse, reponseRepository, questionRepository) {
        this.quizService = quizService;
        this.apiResponse = apiResponse;
        this.reponseRepository = reponseRepository;
        this.questionRepository = questionRepository;
    }
    async getAll(page = 1, limit = 30) {
        const pageNum = typeof page === "string" ? parseInt(page, 10) : page || 1;
        const limitNum = typeof limit === "string" ? parseInt(limit, 10) : limit || 30;
        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await this.reponseRepository.findAndCount({
            skip,
            take: limitNum,
            relations: ["question"],
            order: { id: "DESC" },
        });
        const members = data.map((r) => this.quizService.formatReponseJsonLd(r));
        return {
            "@context": "/api/contexts/Reponse",
            "@id": "/api/reponses",
            "@type": "Collection",
            member: members,
            totalItems: total,
        };
    }
    async create(createReponseDto) {
        const question = await this.questionRepository.findOne({
            where: { id: createReponseDto.question_id },
        });
        if (!question) {
            throw new common_1.NotFoundException("Question non trouvée");
        }
        const reponse = this.reponseRepository.create({
            text: createReponseDto.texte || createReponseDto.text,
            isCorrect: createReponseDto.correct || createReponseDto.is_correct || false,
            position: createReponseDto.position || createReponseDto.ordre,
            flashcardBack: createReponseDto.flashcard_back || createReponseDto.explanation,
            question_id: createReponseDto.question_id,
            match_pair: createReponseDto.match_pair,
            bank_group: createReponseDto.bank_group,
        });
        const saved = await this.reponseRepository.save(reponse);
        const result = await this.reponseRepository.findOne({
            where: { id: saved.id },
            relations: ["question"],
        });
        return this.quizService.formatReponseJsonLd(result);
    }
    async getById(id) {
        const reponse = await this.reponseRepository.findOne({
            where: { id },
            relations: ["question"],
        });
        if (!reponse) {
            throw new common_1.NotFoundException("Réponse non trouvée");
        }
        return this.quizService.formatReponseJsonLd(reponse);
    }
    async update(id, updateReponseDto) {
        const reponse = await this.reponseRepository.findOne({
            where: { id },
            relations: ["question"],
        });
        if (!reponse) {
            throw new common_1.NotFoundException("Réponse non trouvée");
        }
        Object.assign(reponse, {
            text: updateReponseDto.texte ?? updateReponseDto.text ?? reponse.text,
            isCorrect: updateReponseDto.correct ??
                updateReponseDto.is_correct ??
                reponse.isCorrect,
            position: updateReponseDto.position ?? updateReponseDto.ordre ?? reponse.position,
            flashcardBack: updateReponseDto.flashcard_back ??
                updateReponseDto.explanation ??
                reponse.flashcardBack,
            match_pair: updateReponseDto.match_pair ?? reponse.match_pair,
            bank_group: updateReponseDto.bank_group ?? reponse.bank_group,
        });
        await this.reponseRepository.save(reponse);
        const updated = await this.reponseRepository.findOne({
            where: { id },
            relations: ["question"],
        });
        return this.quizService.formatReponseJsonLd(updated);
    }
    async delete(id) {
        const reponse = await this.reponseRepository.findOne({
            where: { id },
        });
        if (!reponse) {
            throw new common_1.NotFoundException("Réponse non trouvée");
        }
        await this.reponseRepository.remove(reponse);
        return { id, message: "Réponse supprimée avec succès" };
    }
};
exports.ReponseApiController = ReponseApiController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ReponseApiController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReponseApiController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReponseApiController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ReponseApiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReponseApiController.prototype, "delete", null);
exports.ReponseApiController = ReponseApiController = __decorate([
    (0, common_1.Controller)("reponses"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(2, (0, typeorm_1.InjectRepository)(reponse_entity_1.Reponse)),
    __param(3, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __metadata("design:paramtypes", [quiz_service_1.QuizService,
        api_response_service_1.ApiResponseService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReponseApiController);
//# sourceMappingURL=reponses-api.controller.js.map