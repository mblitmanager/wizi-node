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
exports.AdminQuizController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quiz_entity_1 = require("../entities/quiz.entity");
const api_response_service_1 = require("../common/services/api-response.service");
let AdminQuizController = class AdminQuizController {
    constructor(quizRepository, apiResponse) {
        this.quizRepository = quizRepository;
        this.apiResponse = apiResponse;
    }
    async findAll(page = 1, limit = 10, search = "") {
        const query = this.quizRepository.createQueryBuilder("q")
            .leftJoinAndSelect("q.questions", "questions")
            .leftJoinAndSelect("q.formations", "formations");
        if (search) {
            query.where("q.titre LIKE :search OR q.description LIKE :search", {
                search: `%${search}%`,
            });
        }
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy("q.id", "DESC")
            .getManyAndCount();
        return this.apiResponse.paginated(data, total, page, limit);
    }
    async findOne(id) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
            relations: ["questions", "questions.reponses", "formations"],
        });
        if (!quiz) {
            throw new common_1.NotFoundException("Quiz non trouvé");
        }
        return this.apiResponse.success(quiz);
    }
    async create(data) {
        if (!data.titre) {
            throw new common_1.BadRequestException("titre est obligatoire");
        }
        const quiz = this.quizRepository.create(data);
        const saved = await this.quizRepository.save(quiz);
        return this.apiResponse.success(saved);
    }
    async update(id, data) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
        });
        if (!quiz) {
            throw new common_1.NotFoundException("Quiz non trouvé");
        }
        await this.quizRepository.update(id, data);
        const updated = await this.quizRepository.findOne({
            where: { id },
            relations: ["questions", "questions.reponses", "formations"],
        });
        return this.apiResponse.success(updated);
    }
    async remove(id) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
        });
        if (!quiz) {
            throw new common_1.NotFoundException("Quiz non trouvé");
        }
        await this.quizRepository.delete(id);
        return this.apiResponse.success();
    }
    async duplicate(id) {
        const original = await this.quizRepository.findOne({
            where: { id },
            relations: ["questions", "questions.reponses"],
        });
        if (!original) {
            throw new common_1.NotFoundException("Quiz non trouvé");
        }
        const newQuiz = this.quizRepository.create({
            ...original,
            titre: `${original.titre} (Copie)`,
            id: undefined,
        });
        const saved = await this.quizRepository.save(newQuiz);
        return this.apiResponse.success(saved);
    }
    async enable(id) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
        });
        if (!quiz) {
            throw new common_1.NotFoundException("Quiz non trouvé");
        }
        await this.quizRepository.update(id, { status: "actif" });
        const updated = await this.quizRepository.findOne({
            where: { id },
            relations: ["questions", "questions.reponses", "formations"],
        });
        return this.apiResponse.success(updated);
    }
    async disable(id) {
        const quiz = await this.quizRepository.findOne({
            where: { id },
        });
        if (!quiz) {
            throw new common_1.NotFoundException("Quiz non trouvé");
        }
        await this.quizRepository.update(id, { status: "inactif" });
        const updated = await this.quizRepository.findOne({
            where: { id },
            relations: ["questions", "questions.reponses", "formations"],
        });
        return this.apiResponse.success(updated);
    }
};
exports.AdminQuizController = AdminQuizController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AdminQuizController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminQuizController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminQuizController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminQuizController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminQuizController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/duplicate"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminQuizController.prototype, "duplicate", null);
__decorate([
    (0, common_1.Patch)(":id/enable"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminQuizController.prototype, "enable", null);
__decorate([
    (0, common_1.Patch)(":id/disable"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminQuizController.prototype, "disable", null);
exports.AdminQuizController = AdminQuizController = __decorate([
    (0, common_1.Controller)("admin/quiz"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], AdminQuizController);
//# sourceMappingURL=admin-quiz.controller.js.map