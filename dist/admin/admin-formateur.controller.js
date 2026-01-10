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
exports.AdminFormateurController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const formateur_entity_1 = require("../entities/formateur.entity");
let AdminFormateurController = class AdminFormateurController {
    constructor(formateurRepository) {
        this.formateurRepository = formateurRepository;
    }
    async findAll(page = 1, limit = 10, search = "") {
        const query = this.formateurRepository.createQueryBuilder("f")
            .leftJoinAndSelect("f.user", "user")
            .leftJoinAndSelect("f.stagiaires", "stagiaires")
            .leftJoinAndSelect("f.formations", "formations");
        if (search) {
            query.where("f.prenom LIKE :search OR user.email LIKE :search", {
                search: `%${search}%`,
            });
        }
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy("f.created_at", "DESC")
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
        return this.formateurRepository.findOne({
            where: { id },
            relations: ["user", "stagiaires", "formations"],
        });
    }
    async create(data) {
        const formateur = this.formateurRepository.create(data);
        return this.formateurRepository.save(formateur);
    }
    async update(id, data) {
        await this.formateurRepository.update(id, data);
        return this.findOne(id);
    }
    async remove(id) {
        return this.formateurRepository.delete(id);
    }
};
exports.AdminFormateurController = AdminFormateurController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminFormateurController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminFormateurController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminFormateurController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminFormateurController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminFormateurController.prototype, "remove", null);
exports.AdminFormateurController = AdminFormateurController = __decorate([
    (0, common_1.Controller)("admin/formateurs"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(formateur_entity_1.Formateur)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminFormateurController);
//# sourceMappingURL=admin-formateur.controller.js.map