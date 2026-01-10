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
exports.AdminCommercialController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const commercial_entity_1 = require("../entities/commercial.entity");
const api_response_service_1 = require("../common/services/api-response.service");
let AdminCommercialController = class AdminCommercialController {
    constructor(commercialRepository, apiResponse) {
        this.commercialRepository = commercialRepository;
        this.apiResponse = apiResponse;
    }
    async index(page = 1, limit = 10, search = "") {
        const query = this.commercialRepository.createQueryBuilder("c");
        if (search) {
            query.where("c.name LIKE :search OR c.email LIKE :search", {
                search: `%${search}%`,
            });
        }
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy("c.id", "DESC")
            .getManyAndCount();
        return this.apiResponse.paginated(data, total, page, limit);
    }
    async store(data) {
        if (!data.name || !data.email) {
            throw new common_1.BadRequestException("name et email sont obligatoires");
        }
        const commercial = this.commercialRepository.create(data);
        const saved = await this.commercialRepository.save(commercial);
        return this.apiResponse.success(saved);
    }
    async show(id) {
        const commercial = await this.commercialRepository.findOne({
            where: { id },
        });
        if (!commercial) {
            throw new common_1.NotFoundException("Commercial non trouvé");
        }
        return this.apiResponse.success(commercial);
    }
    async update(id, data) {
        const commercial = await this.commercialRepository.findOne({
            where: { id },
        });
        if (!commercial) {
            throw new common_1.NotFoundException("Commercial non trouvé");
        }
        await this.commercialRepository.update(id, data);
        const updated = await this.commercialRepository.findOne({
            where: { id },
        });
        return this.apiResponse.success(updated);
    }
    async patch(id, data) {
        const commercial = await this.commercialRepository.findOne({
            where: { id },
        });
        if (!commercial) {
            throw new common_1.NotFoundException("Commercial non trouvé");
        }
        await this.commercialRepository.update(id, data);
        const updated = await this.commercialRepository.findOne({
            where: { id },
        });
        return this.apiResponse.success(updated);
    }
    async destroy(id) {
        const commercial = await this.commercialRepository.findOne({
            where: { id },
        });
        if (!commercial) {
            throw new common_1.NotFoundException("Commercial non trouvé");
        }
        await this.commercialRepository.delete(id);
        return this.apiResponse.success();
    }
};
exports.AdminCommercialController = AdminCommercialController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminCommercialController.prototype, "index", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCommercialController.prototype, "store", null);
__decorate([
    (0, common_1.Get)(":commercial"),
    __param(0, (0, common_1.Param)("commercial")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminCommercialController.prototype, "show", null);
__decorate([
    (0, common_1.Put)(":commercial"),
    __param(0, (0, common_1.Param)("commercial")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminCommercialController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":commercial"),
    __param(0, (0, common_1.Param)("commercial")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminCommercialController.prototype, "patch", null);
__decorate([
    (0, common_1.Delete)(":commercial"),
    __param(0, (0, common_1.Param)("commercial")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminCommercialController.prototype, "destroy", null);
exports.AdminCommercialController = AdminCommercialController = __decorate([
    (0, common_1.Controller)("administrateur/commercials"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(commercial_entity_1.Commercial)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], AdminCommercialController);
//# sourceMappingURL=admin-commercial.controller.js.map