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
exports.CommercialController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const commercial_entity_1 = require("../entities/commercial.entity");
let CommercialController = class CommercialController {
    constructor(commercialRepository) {
        this.commercialRepository = commercialRepository;
    }
    async findAll(page = 1, limit = 10, search = "") {
        const query = this.commercialRepository.createQueryBuilder("c")
            .leftJoinAndSelect("c.user", "user")
            .leftJoinAndSelect("c.stagiaires", "stagiaires");
        if (search) {
            query.where("c.prenom LIKE :search OR user.email LIKE :search", {
                search: `%${search}%`,
            });
        }
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy("c.created_at", "DESC")
            .getManyAndCount();
        return {
            data,
            pagination: {
                total,
                page,
                total_pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        return this.commercialRepository.findOne({
            where: { id },
            relations: ["user", "stagiaires"],
        });
    }
    async create(data) {
        const commercial = this.commercialRepository.create(data);
        return this.commercialRepository.save(commercial);
    }
    async update(id, data) {
        await this.commercialRepository.update(id, data);
        return this.findOne(id);
    }
    async remove(id) {
        return this.commercialRepository.delete(id);
    }
};
exports.CommercialController = CommercialController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CommercialController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommercialController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommercialController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommercialController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommercialController.prototype, "remove", null);
exports.CommercialController = CommercialController = __decorate([
    (0, common_1.Controller)("admin/commerciaux"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(commercial_entity_1.Commercial)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CommercialController);
//# sourceMappingURL=commercial.controller.js.map