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
exports.AdminDemandeHistoriqueController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const demande_inscription_entity_1 = require("../entities/demande-inscription.entity");
const api_response_service_1 = require("../common/services/api-response.service");
let AdminDemandeHistoriqueController = class AdminDemandeHistoriqueController {
    constructor(demandeRepository, apiResponse) {
        this.demandeRepository = demandeRepository;
        this.apiResponse = apiResponse;
    }
    async index(page = 1, limit = 10, search = "") {
        try {
            const query = this.demandeRepository
                .createQueryBuilder("d")
                .leftJoinAndSelect("d.stagiaire", "s")
                .leftJoinAndSelect("d.catalogue_formation", "cf");
            if (search) {
                query.where("s.prenom LIKE :search OR s.nom LIKE :search OR cf.titre LIKE :search", {
                    search: `%${search}%`,
                });
            }
            const [data, total] = await query
                .skip((page - 1) * limit)
                .take(limit)
                .orderBy("d.id", "DESC")
                .getManyAndCount();
            return this.apiResponse.paginated(data, total, page, limit);
        }
        catch (error) {
            console.error("Error in demande historique:", error);
            return this.apiResponse.paginated([], 0, page, limit);
        }
    }
    async show(id) {
        const demande = await this.demandeRepository.findOne({
            where: { id },
            relations: ["stagiaire", "catalogue_formation"],
        });
        if (!demande) {
            return this.apiResponse.error("Demande non trouvée", 404);
        }
        return this.apiResponse.success(demande);
    }
    async exportCsv(res) {
        res.setHeader("Content-Type", "text/csv");
        res.attachment("demandes.csv");
        return res.send("id,stagiaire,formation,date\n1,Test,Test Formation,2024-01-01");
    }
    async exportXlsx(res) {
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.attachment("demandes.xlsx");
        return res.send("XLSX content placeholder");
    }
};
exports.AdminDemandeHistoriqueController = AdminDemandeHistoriqueController;
__decorate([
    (0, common_1.Get)("demande/historique"),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminDemandeHistoriqueController.prototype, "index", null);
__decorate([
    (0, common_1.Get)("demande/historique/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminDemandeHistoriqueController.prototype, "show", null);
__decorate([
    (0, common_1.Get)("demandes/export/csv"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDemandeHistoriqueController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)("demandes/export/xlsx"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDemandeHistoriqueController.prototype, "exportXlsx", null);
exports.AdminDemandeHistoriqueController = AdminDemandeHistoriqueController = __decorate([
    (0, common_1.Controller)("admin"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(demande_inscription_entity_1.DemandeInscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], AdminDemandeHistoriqueController);
//# sourceMappingURL=admin-demande-historique.controller.js.map