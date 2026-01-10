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
exports.AdminQuestionController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const question_entity_1 = require("../entities/question.entity");
const api_response_service_1 = require("../common/services/api-response.service");
let AdminQuestionController = class AdminQuestionController {
    constructor(questionRepository, apiResponse) {
        this.questionRepository = questionRepository;
        this.apiResponse = apiResponse;
    }
    async findAll(page = 1, limit = 10, search = "") {
        const query = this.questionRepository.createQueryBuilder("q")
            .leftJoinAndSelect("q.reponses", "reponses")
            .leftJoinAndSelect("q.quiz", "quiz");
        if (search) {
            query.where("q.texte LIKE :search", { search: `%${search}%` });
        }
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy("q.id", "DESC")
            .getManyAndCount();
        return this.apiResponse.paginated(data, total, page, limit);
    }
    async findOne(id) {
        const question = await this.questionRepository.findOne({
            where: { id },
            relations: ["reponses", "quiz"],
        });
        if (!question) {
            throw new common_1.NotFoundException("Question not found");
        }
        return this.apiResponse.success(question);
    }
    async create(data) {
        if (!data.texte) {
            throw new common_1.BadRequestException("texte is required");
        }
        const question = this.questionRepository.create(data);
        const saved = await this.questionRepository.save(question);
        return this.apiResponse.success(saved);
    }
    async update(id, data) {
        const question = await this.questionRepository.findOne({
            where: { id },
        });
        if (!question) {
            throw new common_1.NotFoundException("Question not found");
        }
        await this.questionRepository.update(id, data);
        const updated = await this.questionRepository.findOne({
            where: { id },
            relations: ["reponses", "quiz"],
        });
        return this.apiResponse.success(updated);
    }
    async remove(id) {
        const question = await this.questionRepository.findOne({
            where: { id },
        });
        if (!question) {
            throw new common_1.NotFoundException("Question not found");
        }
        await this.questionRepository.delete(id);
        return this.apiResponse.success();
    }
};
exports.AdminQuestionController = AdminQuestionController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminQuestionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminQuestionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminQuestionController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminQuestionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminQuestionController.prototype, "remove", null);
exports.AdminQuestionController = AdminQuestionController = __decorate([
    (0, common_1.Controller)("admin/questions"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], AdminQuestionController);
//# sourceMappingURL=admin-question.controller.js.map