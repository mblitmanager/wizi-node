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
exports.FormationController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const formation_service_1 = require("./formation.service");
let FormationController = class FormationController {
    constructor(formationService) {
        this.formationService = formationService;
    }
    async getAllFormations() {
        return this.formationService.getAllCatalogueFormations();
    }
    async getAllCatalogue() {
        return this.formationService.getAllCatalogueFormations();
    }
    async getAllFormationsAlias() {
        return this.formationService.getAllCatalogueFormations();
    }
    async getWithFormations(req) {
        return this.formationService.getCataloguesWithFormations(req.query);
    }
    async getStagiaireFormations(req) {
        const stagiaireId = req.user.stagiaire?.id;
        if (!stagiaireId) {
            return [];
        }
        return this.formationService.getFormationsAndCatalogues(stagiaireId);
    }
};
exports.FormationController = FormationController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormationController.prototype, "getAllFormations", null);
__decorate([
    (0, common_1.Get)("catalogue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormationController.prototype, "getAllCatalogue", null);
__decorate([
    (0, common_1.Get)("formations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormationController.prototype, "getAllFormationsAlias", null);
__decorate([
    (0, common_1.Get)("with-formations"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormationController.prototype, "getWithFormations", null);
__decorate([
    (0, common_1.Get)("stagiaire"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormationController.prototype, "getStagiaireFormations", null);
exports.FormationController = FormationController = __decorate([
    (0, common_1.Controller)("catalogueFormations"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [formation_service_1.FormationService])
], FormationController);
//# sourceMappingURL=formation.controller.js.map