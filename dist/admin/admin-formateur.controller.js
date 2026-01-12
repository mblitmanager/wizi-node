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
const api_response_service_1 = require("../common/services/api-response.service");
let AdminFormateurController = class AdminFormateurController {
    constructor(formateurRepository, apiResponse) {
        this.formateurRepository = formateurRepository;
        this.apiResponse = apiResponse;
    }
    async findAll(page = 1, limit = 10, search = "") {
        const query = this.formateurRepository
            .createQueryBuilder("f")
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
        return this.apiResponse.paginated(data, total, page, limit);
    }
    async findOne(id) {
        const formateur = await this.formateurRepository.findOne({
            where: { id },
            relations: ["user", "stagiaires", "formations"],
        });
        if (!formateur) {
            throw new common_1.NotFoundException("Formateur non trouvé");
        }
        return this.apiResponse.success(formateur);
    }
    async create(data) {
        if (!data.prenom || !data.nom) {
            throw new common_1.BadRequestException("prenom et nom sont obligatoires");
        }
        const formateur = this.formateurRepository.create(data);
        const saved = await this.formateurRepository.save(formateur);
        return this.apiResponse.success(saved);
    }
    async update(id, data) {
        const formateur = await this.formateurRepository.findOne({
            where: { id },
        });
        if (!formateur) {
            throw new common_1.NotFoundException("Formateur non trouvé");
        }
        await this.formateurRepository.update(id, data);
        const updated = await this.formateurRepository.findOne({
            where: { id },
            relations: ["user", "stagiaires", "formations"],
        });
        return this.apiResponse.success(updated);
    }
    async remove(id) {
        const formateur = await this.formateurRepository.findOne({
            where: { id },
        });
        if (!formateur) {
            throw new common_1.NotFoundException("Formateur non trouvé");
        }
        await this.formateurRepository.delete(id);
        return this.apiResponse.success();
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
    (0, common_1.Controller)("administrateur/formateur"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(formateur_entity_1.Formateur)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], AdminFormateurController);
//# sourceMappingURL=admin-formateur.controller.js.map