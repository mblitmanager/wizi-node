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
exports.FormateurQuizController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const api_response_service_1 = require("../common/services/api-response.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quiz_entity_1 = require("../entities/quiz.entity");
const question_entity_1 = require("../entities/question.entity");
const reponse_entity_1 = require("../entities/reponse.entity");
const formation_entity_1 = require("../entities/formation.entity");
let FormateurQuizController = class FormateurQuizController {
    constructor(quizRepository, questionRepository, reponseRepository, formationRepository, apiResponse) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.reponseRepository = reponseRepository;
        this.formationRepository = formationRepository;
        this.apiResponse = apiResponse;
    }
    async index(query) {
        const queryBuilder = this.quizRepository
            .createQueryBuilder("quiz")
            .leftJoinAndSelect("quiz.questions", "questions")
            .leftJoinAndSelect("quiz.formation", "formation");
        if (query.formation_id) {
            queryBuilder.where("quiz.formation_id = :formationId", {
                formationId: query.formation_id,
            });
        }
        if (query.status) {
            queryBuilder.andWhere("quiz.status = :status", { status: query.status });
        }
        const quizzes = await queryBuilder
            .orderBy("quiz.created_at", "DESC")
            .getMany();
        const quizzesData = quizzes.map((quiz) => ({
            id: quiz.id,
            titre: quiz.titre,
            description: quiz.description,
            duree: quiz.duree,
            niveau: quiz.niveau,
            nb_points_total: quiz.nb_points_total,
            status: quiz.status || "actif",
            formation: quiz.formation
                ? {
                    id: quiz.formation.id,
                    nom: quiz.formation.titre,
                }
                : null,
            nb_questions: quiz.questions?.length || 0,
            created_at: quiz.created_at,
        }));
        return this.apiResponse.success({ quizzes: quizzesData });
    }
    async show(id) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
            relations: ["questions", "questions.reponses", "formation"],
        });
        if (!quiz) {
            throw new common_1.HttpException("Quiz non trouvé", common_1.HttpStatus.NOT_FOUND);
        }
        const questionsData = (quiz.questions || [])
            .map((question) => ({
            id: question.id,
            question: question.text,
            type: question.type || "qcm",
            ordre: question.ordre || 0,
            reponses: (question.reponses || []).map((reponse) => ({
                id: reponse.id,
                reponse: reponse.text,
                correct: !!reponse.isCorrect,
            })),
        }))
            .sort((a, b) => a.ordre - b.ordre);
        return this.apiResponse.success({
            quiz: {
                id: quiz.id,
                titre: quiz.titre,
                description: quiz.description,
                duree: quiz.duree,
                niveau: quiz.niveau,
                nb_points_total: quiz.nb_points_total,
                status: quiz.status,
                nb_questions: quiz.questions?.length || 0,
                formation_id: quiz.formation_id,
                formation_nom: quiz.formation?.titre,
                formation: quiz.formation
                    ? {
                        id: quiz.formation.id,
                        nom: quiz.formation.titre,
                    }
                    : null,
            },
            questions: questionsData,
        });
    }
    async store(data) {
        const quiz = this.quizRepository.create({
            titre: data.titre,
            description: data.description,
            duree: data.duree,
            niveau: data.niveau,
            formation_id: data.formation_id,
            status: data.status || "brouillon",
            nb_points_total: "0",
        });
        await this.quizRepository.save(quiz);
        return this.apiResponse.success({
            success: true,
            message: "Quiz créé avec succès",
            quiz: {
                id: quiz.id,
                titre: quiz.titre,
                status: quiz.status,
            },
        }, "Quiz créé avec succès");
    }
    async update(id, data) {
        const quiz = await this.quizRepository.findOne({ where: { id } });
        if (!quiz) {
            throw new common_1.HttpException("Quiz non trouvé", common_1.HttpStatus.NOT_FOUND);
        }
        Object.assign(quiz, {
            titre: data.titre || quiz.titre,
            description: data.description !== undefined ? data.description : quiz.description,
            duree: data.duree || quiz.duree,
            niveau: data.niveau || quiz.niveau,
            formation_id: data.formation_id !== undefined ? data.formation_id : quiz.formation_id,
            status: data.status || quiz.status,
        });
        await this.quizRepository.save(quiz);
        return this.apiResponse.success({
            success: true,
            message: "Quiz mis à jour",
            quiz: {
                id: quiz.id,
                titre: quiz.titre,
            },
        });
    }
    async destroy(id) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
            relations: ["quiz_participations"],
        });
        if (!quiz) {
            throw new common_1.HttpException("Quiz non trouvé", common_1.HttpStatus.NOT_FOUND);
        }
        if (quiz.quiz_participations?.length > 0) {
            throw new common_1.HttpException("Impossible de supprimer un quiz avec des participations. Archivez-le plutôt.", common_1.HttpStatus.BAD_REQUEST);
        }
        await this.quizRepository.remove(quiz);
        return this.apiResponse.success({
            success: true,
            message: "Quiz supprimé",
        }, "Quiz supprimé avec succès");
    }
    async addQuestion(id, data) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
            relations: ["questions"],
        });
        if (!quiz) {
            throw new common_1.HttpException("Quiz non trouvé", common_1.HttpStatus.NOT_FOUND);
        }
        const hasCorrect = data.reponses.some((r) => r.correct);
        if (!hasCorrect) {
            throw new common_1.HttpException("Au moins une réponse doit être correcte", common_1.HttpStatus.BAD_REQUEST);
        }
        const question = this.questionRepository.create({
            quiz_id: quiz.id,
            text: data.question,
            type: data.type || "qcm",
            points: "1",
        });
        await this.questionRepository.save(question);
        for (const reponseData of data.reponses) {
            const reponse = this.reponseRepository.create({
                question_id: question.id,
                text: reponseData.reponse,
                isCorrect: reponseData.correct ? true : false,
            });
            await this.reponseRepository.save(reponse);
        }
        const points = ((quiz.questions?.length || 0) + 1) * 2;
        quiz.nb_points_total = points.toString();
        await this.quizRepository.save(quiz);
        return this.apiResponse.success({
            success: true,
            message: "Question ajoutée",
            question: {
                id: question.id,
                question: question.text,
            },
        }, "Question ajoutée avec succès");
    }
    async updateQuestion(quizId, questionId, data) {
        const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
        const question = await this.questionRepository.findOne({
            where: { id: questionId, quiz_id: quizId },
        });
        if (!quiz || !question) {
            throw new common_1.HttpException("Quiz ou question non trouvé", common_1.HttpStatus.NOT_FOUND);
        }
        if (data.question) {
            question.text = data.question;
        }
        if (data.type) {
            question.type = data.type;
        }
        await this.questionRepository.save(question);
        if (data.reponses) {
            await this.reponseRepository.delete({ question_id: questionId });
            for (const r of data.reponses) {
                const reponse = this.reponseRepository.create({
                    question_id: question.id,
                    text: r.reponse,
                    isCorrect: r.correct ? true : false,
                });
                await this.reponseRepository.save(reponse);
            }
        }
        return this.apiResponse.success({
            success: true,
            message: "Question mise à jour",
        });
    }
    async deleteQuestion(quizId, questionId) {
        const quiz = await this.quizRepository.findOne({
            where: { id: quizId },
            relations: ["questions"],
        });
        const question = await this.questionRepository.findOne({
            where: { id: questionId, quiz_id: quizId },
        });
        if (!quiz || !question) {
            throw new common_1.HttpException("Quiz ou question non trouvé", common_1.HttpStatus.NOT_FOUND);
        }
        await this.questionRepository.remove(question);
        const points = ((quiz.questions?.length || 0) - 1) * 2;
        quiz.nb_points_total = points.toString();
        await this.quizRepository.save(quiz);
        return this.apiResponse.success({
            success: true,
            message: "Question supprimée",
        });
    }
    async publish(id) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
            relations: ["questions"],
        });
        if (!quiz) {
            throw new common_1.HttpException("Quiz non trouvé", common_1.HttpStatus.NOT_FOUND);
        }
        if ((quiz.questions?.length || 0) === 0) {
            throw new common_1.HttpException("Impossible de publier un quiz sans questions", common_1.HttpStatus.BAD_REQUEST);
        }
        quiz.status = "actif";
        await this.quizRepository.save(quiz);
        return this.apiResponse.success({
            success: true,
            message: "Quiz publié avec succès",
        });
    }
    async getFormations() {
        const formations = await this.formationRepository.find({
            select: ["id", "titre"],
            order: { titre: "ASC" },
        });
        return this.apiResponse.success({ formations });
    }
};
exports.FormateurQuizController = FormateurQuizController;
__decorate([
    (0, common_1.Get)("quizzes"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurQuizController.prototype, "index", null);
__decorate([
    (0, common_1.Get)("quizzes/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurQuizController.prototype, "show", null);
__decorate([
    (0, common_1.Post)("quizzes"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormateurQuizController.prototype, "store", null);
__decorate([
    (0, common_1.Put)("quizzes/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurQuizController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("quizzes/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurQuizController.prototype, "destroy", null);
__decorate([
    (0, common_1.Post)(":id/questions"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurQuizController.prototype, "addQuestion", null);
__decorate([
    (0, common_1.Put)("quizzes/:quizId/questions/:questionId"),
    __param(0, (0, common_1.Param)("quizId")),
    __param(1, (0, common_1.Param)("questionId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], FormateurQuizController.prototype, "updateQuestion", null);
__decorate([
    (0, common_1.Delete)("quizzes/:quizId/questions/:questionId"),
    __param(0, (0, common_1.Param)("quizId")),
    __param(1, (0, common_1.Param)("questionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FormateurQuizController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Post)("quizzes/:id/publish"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormateurQuizController.prototype, "publish", null);
__decorate([
    (0, common_1.Get)("formations-list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormateurQuizController.prototype, "getFormations", null);
exports.FormateurQuizController = FormateurQuizController = __decorate([
    (0, common_1.Controller)("formateur"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("formateur", "formatrice"),
    __param(0, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __param(1, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(2, (0, typeorm_1.InjectRepository)(reponse_entity_1.Reponse)),
    __param(3, (0, typeorm_1.InjectRepository)(formation_entity_1.Formation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], FormateurQuizController);
//# sourceMappingURL=formateur-quiz.controller.js.map