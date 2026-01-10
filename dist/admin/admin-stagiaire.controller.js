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
exports.AdminStagiaireController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const api_response_service_1 = require("../common/services/api-response.service");
let AdminStagiaireController = class AdminStagiaireController {
    constructor(stagiaireRepository, apiResponse) {
        this.stagiaireRepository = stagiaireRepository;
        this.apiResponse = apiResponse;
    }
    async findAll(page = 1, limit = 10, search = "") {
        const query = this.stagiaireRepository
            .createQueryBuilder("s")
            .leftJoinAndSelect("s.user", "user")
            .leftJoinAndSelect("s.catalogue_formations", "catalogue_formations");
        if (search) {
            query.where("s.prenom LIKE :search OR s.civilite LIKE :search OR s.ville LIKE :search", { search: `%${search}%` });
        }
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy("s.created_at", "DESC")
            .getManyAndCount();
        return this.apiResponse.paginated(data, total, page, limit);
    }
    async findOne(id) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id },
            relations: ["user", "catalogue_formations", "achievements"],
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException("Stagiaire non trouvé");
        }
        return this.apiResponse.success(stagiaire);
    }
    async create(data) {
        if (!data.user_id) {
            throw new common_1.BadRequestException("user_id est obligatoire");
        }
        const stagiaire = this.stagiaireRepository.create(data);
        const saved = await this.stagiaireRepository.save(stagiaire);
        return this.apiResponse.success(saved);
    }
    async update(id, data) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id },
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException("Stagiaire non trouvé");
        }
        await this.stagiaireRepository.update(id, data);
        const updated = await this.stagiaireRepository.findOne({
            where: { id },
            relations: ["user", "catalogue_formations", "achievements"],
        });
        return this.apiResponse.success(updated);
    }
    async remove(id) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id },
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException("Stagiaire non trouvé");
        }
        await this.stagiaireRepository.delete(id);
        return this.apiResponse.success();
    }
};
exports.AdminStagiaireController = AdminStagiaireController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AdminStagiaireController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminStagiaireController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminStagiaireController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminStagiaireController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminStagiaireController.prototype, "remove", null);
exports.AdminStagiaireController = AdminStagiaireController = __decorate([
    (0, common_1.Controller)("admin/stagiaires"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], AdminStagiaireController);
//# sourceMappingURL=admin-stagiaire.controller.js.map