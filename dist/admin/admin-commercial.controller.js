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
let AdminCommercialController = class AdminCommercialController {
    constructor(commercialRepository) {
        this.commercialRepository = commercialRepository;
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
        return {
            data,
            pagination: { total, page, total_pages: Math.ceil(total / limit) },
        };
    }
    async create() {
        return { message: "Create commercial form" };
    }
    async store(data) {
        const commercial = this.commercialRepository.create(data);
        return this.commercialRepository.save(commercial);
    }
    async show(id) {
        return this.commercialRepository.findOne({ where: { id } });
    }
    async edit(id) {
        const commercial = await this.commercialRepository.findOne({
            where: { id },
        });
        return { form: commercial };
    }
    async update(id, data) {
        await this.commercialRepository.update(id, data);
        return this.commercialRepository.findOne({ where: { id } });
    }
    async patch(id, data) {
        await this.commercialRepository.update(id, data);
        return this.commercialRepository.findOne({ where: { id } });
    }
    async destroy(id) {
        return this.commercialRepository.delete(id);
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
    (0, common_1.Get)("create"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCommercialController.prototype, "create", null);
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
    (0, common_1.Get)(":commercial/edit"),
    __param(0, (0, common_1.Param)("commercial")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminCommercialController.prototype, "edit", null);
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
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminCommercialController);
//# sourceMappingURL=admin-commercial.controller.js.map