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
exports.StagiairesController = void 0;
const common_1 = require("@nestjs/common");
const stagiaire_service_1 = require("./stagiaire.service");
let StagiairesController = class StagiairesController {
    constructor(stagiaireService) {
        this.stagiaireService = stagiaireService;
    }
    async getStagiaireDetails(id) {
        try {
            const stagiaire = await this.stagiaireService.getStagiaireById(id);
            if (!stagiaire) {
                throw new common_1.HttpException("Stagiaire not found", common_1.HttpStatus.NOT_FOUND);
            }
            return stagiaire;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.StagiairesController = StagiairesController;
__decorate([
    (0, common_1.Get)(":id/details"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StagiairesController.prototype, "getStagiaireDetails", null);
exports.StagiairesController = StagiairesController = __decorate([
    (0, common_1.Controller)("stagiaires"),
    __metadata("design:paramtypes", [stagiaire_service_1.StagiaireService])
], StagiairesController);
//# sourceMappingURL=stagiaires.controller.js.map