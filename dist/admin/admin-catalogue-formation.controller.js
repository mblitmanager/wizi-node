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
exports.AdminCatalogueFormationController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
let AdminCatalogueFormationController = class AdminCatalogueFormationController {
    constructor(catalogueRepository) {
        this.catalogueRepository = catalogueRepository;
    }
    async index(page = 1, limit = 10, search = "") {
        const query = this.catalogueRepository
            .createQueryBuilder("cf")
            .leftJoinAndSelect("cf.formations", "formations");
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
        return {
            data,
            pagination: { total, page, total_pages: Math.ceil(total / limit) },
        };
    }
    async create() {
        return { message: "Create catalogue formation form" };
    }
    async store(data) {
        const catalogue = this.catalogueRepository.create(data);
        return this.catalogueRepository.save(catalogue);
    }
    async show(id) {
        return this.catalogueRepository.findOne({
            where: { id },
            relations: ["formations"],
        });
    }
    async edit(id) {
        const catalogue = await this.catalogueRepository.findOne({
            where: { id },
            relations: ["formations"],
        });
        return { form: catalogue };
    }
    async update(id, data) {
        await this.catalogueRepository.update(id, data);
        return this.catalogueRepository.findOne({ where: { id } });
    }
    async destroy(id) {
        return this.catalogueRepository.delete(id);
    }
    async duplicate(id) {
        const original = await this.catalogueRepository.findOne({
            where: { id },
            relations: ["formations"],
        });
        if (!original)
            throw new Error("Catalogue not found");
        const newCatalogue = this.catalogueRepository.create({
            ...original,
            titre: `${original.titre} (Copie)`,
            id: undefined,
        });
        return this.catalogueRepository.save(newCatalogue);
    }
    async downloadPdf(id) {
        return { message: "PDF download for catalogue", catalogueId: id };
    }
};
exports.AdminCatalogueFormationController = AdminCatalogueFormationController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminCatalogueFormationController.prototype, "index", null);
__decorate([
    (0, common_1.Get)("create"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCatalogueFormationController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCatalogueFormationController.prototype, "store", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminCatalogueFormationController.prototype, "show", null);
__decorate([
    (0, common_1.Get)(":id/edit"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminCatalogueFormationController.prototype, "edit", null);
__decorate([
    (0, common_1.Put)(":catalogue_formation"),
    __param(0, (0, common_1.Param)("catalogue_formation")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminCatalogueFormationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":catalogue_formation"),
    __param(0, (0, common_1.Param)("catalogue_formation")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminCatalogueFormationController.prototype, "destroy", null);
__decorate([
    (0, common_1.Post)(":id/duplicate"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminCatalogueFormationController.prototype, "duplicate", null);
__decorate([
    (0, common_1.Get)(":id/download-pdf"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminCatalogueFormationController.prototype, "downloadPdf", null);
exports.AdminCatalogueFormationController = AdminCatalogueFormationController = __decorate([
    (0, common_1.Controller)("administrateur/catalogue_formation"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(catalogue_formation_entity_1.CatalogueFormation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminCatalogueFormationController);
//# sourceMappingURL=admin-catalogue-formation.controller.js.map