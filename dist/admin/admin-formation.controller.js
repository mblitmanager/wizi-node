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
exports.AdminFormationController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const formation_entity_1 = require("../entities/formation.entity");
const api_response_service_1 = require("../common/services/api-response.service");
let AdminFormationController = class AdminFormationController {
    constructor(formationRepository, apiResponse) {
        this.formationRepository = formationRepository;
        this.apiResponse = apiResponse;
    }
    async findAll(page = 1, limit = 10, search = "") {
        const query = this.formationRepository
            .createQueryBuilder("cf")
            .leftJoinAndSelect("cf.medias", "medias")
            .leftJoinAndSelect("cf.quizzes", "quizzes");
        if (search) {
            query.where("cf.titre LIKE :search OR cf.description LIKE :search", {
                search: `%${search}%`,
            });
        }
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy("cf.id", "DESC")
            .getManyAndCount();
        return this.apiResponse.paginated(data, total, page, limit);
    }
    async findOne(id) {
        const formation = await this.formationRepository.findOne({
            where: { id },
            relations: ["medias", "quizzes", "stagiaires"],
        });
        if (!formation) {
            throw new common_1.NotFoundException("Formation non trouvée");
        }
        return this.apiResponse.success(formation);
    }
    async create(data) {
        if (!data.titre) {
            throw new common_1.BadRequestException("titre est obligatoire");
        }
        const formation = this.formationRepository.create(data);
        const saved = await this.formationRepository.save(formation);
        return this.apiResponse.success(saved);
    }
    async update(id, data) {
        const formation = await this.formationRepository.findOne({
            where: { id },
        });
        if (!formation) {
            throw new common_1.NotFoundException("Formation non trouvée");
        }
        await this.formationRepository.update(id, data);
        const updated = await this.formationRepository.findOne({
            where: { id },
            relations: ["medias", "quizzes", "stagiaires"],
        });
        return this.apiResponse.success(updated);
    }
    async remove(id) {
        const formation = await this.formationRepository.findOne({
            where: { id },
        });
        if (!formation) {
            throw new common_1.NotFoundException("Formation non trouvée");
        }
        await this.formationRepository.delete(id);
        return this.apiResponse.success();
    }
    async duplicate(id) {
        const original = await this.formationRepository.findOne({
            where: { id },
            relations: ["medias", "quizzes"],
        });
        if (!original) {
            throw new common_1.NotFoundException("Formation non trouvée");
        }
        const newFormation = this.formationRepository.create({
            ...original,
            titre: `${original.titre} (Copie)`,
            id: undefined,
        });
        const saved = await this.formationRepository.save(newFormation);
        return this.apiResponse.success(saved);
    }
};
exports.AdminFormationController = AdminFormationController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AdminFormationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminFormationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminFormationController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminFormationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminFormationController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/duplicate"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminFormationController.prototype, "duplicate", null);
exports.AdminFormationController = AdminFormationController = __decorate([
    (0, common_1.Controller)("admin/formations"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(formation_entity_1.Formation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], AdminFormationController);
//# sourceMappingURL=admin-formation.controller.js.map