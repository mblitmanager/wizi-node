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
exports.FormationParrainageController = exports.CatalogueFormationController = void 0;
const common_1 = require("@nestjs/common");
const catalogue_formation_service_1 = require("./catalogue-formation.service");
const passport_1 = require("@nestjs/passport");
const api_response_service_1 = require("../common/services/api-response.service");
let CatalogueFormationController = class CatalogueFormationController {
    constructor(catalogueService, apiResponse) {
        this.catalogueService = catalogueService;
        this.apiResponse = apiResponse;
    }
    async getAll() {
        return await this.catalogueService.findAll();
    }
    async getAllFormations() {
        return await this.catalogueService.findAll();
    }
    async getWithFormations(req) {
        return await this.catalogueService.getCataloguesWithFormations(req.query);
    }
    async getMyStagiaireCatalogues(req) {
        const stagiaireId = req.user.stagiaire?.id;
        if (!stagiaireId) {
            return this.apiResponse.error("Stagiaire not found for this user", 404);
        }
        return await this.catalogueService.getFormationsAndCatalogues(stagiaireId);
    }
    async getStagiaireCatalogues(id) {
        return await this.catalogueService.getFormationsAndCatalogues(id);
    }
    async getOne(id) {
        const result = await this.catalogueService.findOne(id);
        return result;
    }
    async getAllForParrainage() {
        return await this.catalogueService.findAll();
    }
};
exports.CatalogueFormationController = CatalogueFormationController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogueFormationController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)("formations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogueFormationController.prototype, "getAllFormations", null);
__decorate([
    (0, common_1.Get)("with-formations"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueFormationController.prototype, "getWithFormations", null);
__decorate([
    (0, common_1.Get)("stagiaire"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueFormationController.prototype, "getMyStagiaireCatalogues", null);
__decorate([
    (0, common_1.Get)("stagiaire/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogueFormationController.prototype, "getStagiaireCatalogues", null);
__decorate([
    (0, common_1.Get)("formations/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogueFormationController.prototype, "getOne", null);
__decorate([
    (0, common_1.Get)("formationParrainage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogueFormationController.prototype, "getAllForParrainage", null);
exports.CatalogueFormationController = CatalogueFormationController = __decorate([
    (0, common_1.Controller)("catalogueFormations"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [catalogue_formation_service_1.CatalogueFormationService,
        api_response_service_1.ApiResponseService])
], CatalogueFormationController);
let FormationParrainageController = class FormationParrainageController {
    constructor(catalogueService) {
        this.catalogueService = catalogueService;
    }
    async formations() {
        return await this.catalogueService.findAll();
    }
};
exports.FormationParrainageController = FormationParrainageController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormationParrainageController.prototype, "formations", null);
exports.FormationParrainageController = FormationParrainageController = __decorate([
    (0, common_1.Controller)("formationParrainage"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [catalogue_formation_service_1.CatalogueFormationService])
], FormationParrainageController);
//# sourceMappingURL=catalogue-formation.controller.js.map