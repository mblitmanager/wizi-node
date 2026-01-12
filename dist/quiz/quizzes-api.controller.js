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
exports.QuizzesApiController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_service_1 = require("../common/services/api-response.service");
const quiz_service_1 = require("./quiz.service");
const quiz_entity_1 = require("../entities/quiz.entity");
let QuizzesApiController = class QuizzesApiController {
    constructor(quizService, apiResponse, quizRepository) {
        this.quizService = quizService;
        this.apiResponse = apiResponse;
        this.quizRepository = quizRepository;
    }
    async getAll(page = 1, limit = 30) {
        const pageNum = typeof page === "string" ? parseInt(page, 10) : page || 1;
        const limitNum = typeof limit === "string" ? parseInt(limit, 10) : limit || 30;
        const skip = (pageNum - 1) * limitNum;
        const [quizzes, total] = await this.quizRepository.findAndCount({
            skip,
            take: limitNum,
            relations: ["formation", "questions"],
            order: { id: "DESC" },
        });
        const data = quizzes.map((q) => this.quizService.formatQuizJsonLd(q));
        return {
            "@context": "/api/contexts/Quiz",
            "@id": "/api/quizzes",
            "@type": "Collection",
            member: data,
            totalItems: total,
        };
    }
    async create(createQuizDto) {
        const quiz = this.quizRepository.create({
            titre: createQuizDto.titre,
            description: createQuizDto.description,
            formation_id: createQuizDto.formation_id,
            status: createQuizDto.status || "actif",
            nb_points_total: createQuizDto.nb_points_total || 0,
        });
        const saved = await this.quizRepository.save(quiz);
        const result = await this.quizRepository.findOne({
            where: { id: saved.id },
            relations: ["formation", "questions"],
        });
        return this.quizService.formatQuizJsonLd(result);
    }
    async getById(id) {
        return this.quizService.getQuizJsonLd(id);
    }
    async update(id, updateQuizDto) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
            relations: ["formation", "questions"],
        });
        if (!quiz) {
            throw new common_1.NotFoundException("Quiz non trouvé");
        }
        Object.assign(quiz, {
            titre: updateQuizDto.titre ?? quiz.titre,
            description: updateQuizDto.description ?? quiz.description,
            status: updateQuizDto.status ?? quiz.status,
            nb_points_total: updateQuizDto.nb_points_total ?? quiz.nb_points_total,
        });
        await this.quizRepository.save(quiz);
        const updated = await this.quizRepository.findOne({
            where: { id },
            relations: ["formation", "questions"],
        });
        return this.quizService.formatQuizJsonLd(updated);
    }
    async delete(id) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
        });
        if (!quiz) {
            throw new common_1.NotFoundException("Quiz non trouvé");
        }
        await this.quizRepository.remove(quiz);
        return { id, message: "Quiz supprimé avec succès" };
    }
    async submit(quizId, data, req) {
        return {
            quiz_id: quizId,
            score: 0,
            message: "Quiz soumis",
        };
    }
};
exports.QuizzesApiController = QuizzesApiController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], QuizzesApiController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuizzesApiController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuizzesApiController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], QuizzesApiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuizzesApiController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(":quizId/submit"),
    __param(0, (0, common_1.Param)("quizId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], QuizzesApiController.prototype, "submit", null);
exports.QuizzesApiController = QuizzesApiController = __decorate([
    (0, common_1.Controller)("quizzes"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(2, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __metadata("design:paramtypes", [quiz_service_1.QuizService,
        api_response_service_1.ApiResponseService,
        typeorm_2.Repository])
], QuizzesApiController);
//# sourceMappingURL=quizzes-api.controller.js.map