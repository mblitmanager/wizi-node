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
exports.FormationApiController = void 0;
const common_1 = require("@nestjs/common");
const formation_service_1 = require("./formation.service");
let FormationApiController = class FormationApiController {
    constructor(formationService) {
        this.formationService = formationService;
    }
    async getCategories() {
        return this.formationService.getCategories();
    }
    async getFormationsByCategory(category) {
        return this.formationService.getFormationsByCategory(category);
    }
    async listFormations(page, req) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        return this.formationService.listFormations({
            page: parseInt(page) || 1,
            baseUrl,
        });
    }
};
exports.FormationApiController = FormationApiController;
__decorate([
    (0, common_1.Get)("categories"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormationApiController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)("categories/:category"),
    __param(0, (0, common_1.Param)("category")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormationApiController.prototype, "getFormationsByCategory", null);
__decorate([
    (0, common_1.Get)("listFormation"),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FormationApiController.prototype, "listFormations", null);
exports.FormationApiController = FormationApiController = __decorate([
    (0, common_1.Controller)(["formation", "formations"]),
    __metadata("design:paramtypes", [formation_service_1.FormationService])
], FormationApiController);
//# sourceMappingURL=formation-api.controller.js.map