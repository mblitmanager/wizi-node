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
exports.AdminPoleRelationClientController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pole_relation_client_entity_1 = require("../entities/pole-relation-client.entity");
const api_response_service_1 = require("../common/services/api-response.service");
let AdminPoleRelationClientController = class AdminPoleRelationClientController {
    constructor(prcRepository, apiResponse) {
        this.prcRepository = prcRepository;
        this.apiResponse = apiResponse;
    }
    async index(page = 1, limit = 10, search = "") {
        const query = this.prcRepository.createQueryBuilder("prc");
        if (search) {
            query.where("prc.name LIKE :search OR prc.email LIKE :search", {
                search: `%${search}%`,
            });
        }
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy("prc.id", "DESC")
            .getManyAndCount();
        return this.apiResponse.paginated(data, total, page, limit);
    }
    async store(data) {
        if (!data.name) {
            throw new common_1.BadRequestException("name est obligatoire");
        }
        const prc = this.prcRepository.create(data);
        const saved = await this.prcRepository.save(prc);
        return this.apiResponse.success(saved);
    }
    async show(id) {
        const prc = await this.prcRepository.findOne({ where: { id } });
        if (!prc) {
            throw new common_1.NotFoundException("PRC non trouvé");
        }
        return this.apiResponse.success(prc);
    }
    async update(id, data) {
        const prc = await this.prcRepository.findOne({ where: { id } });
        if (!prc) {
            throw new common_1.NotFoundException("PRC non trouvé");
        }
        await this.prcRepository.update(id, data);
        const updated = await this.prcRepository.findOne({ where: { id } });
        return this.apiResponse.success(updated);
    }
    async destroy(id) {
        const prc = await this.prcRepository.findOne({ where: { id } });
        if (!prc) {
            throw new common_1.NotFoundException("PRC non trouvé");
        }
        await this.prcRepository.delete(id);
        return this.apiResponse.success();
    }
};
exports.AdminPoleRelationClientController = AdminPoleRelationClientController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPoleRelationClientController.prototype, "index", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminPoleRelationClientController.prototype, "store", null);
__decorate([
    (0, common_1.Get)(":pole_relation_client"),
    __param(0, (0, common_1.Param)("pole_relation_client")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminPoleRelationClientController.prototype, "show", null);
__decorate([
    (0, common_1.Put)(":pole_relation_client"),
    __param(0, (0, common_1.Param)("pole_relation_client")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminPoleRelationClientController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":pole_relation_client"),
    __param(0, (0, common_1.Param)("pole_relation_client")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminPoleRelationClientController.prototype, "destroy", null);
exports.AdminPoleRelationClientController = AdminPoleRelationClientController = __decorate([
    (0, common_1.Controller)("admin/pole_relation_clients"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(pole_relation_client_entity_1.PoleRelationClient)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], AdminPoleRelationClientController);
//# sourceMappingURL=admin-prc.controller.js.map