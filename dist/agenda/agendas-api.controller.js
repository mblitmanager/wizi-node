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
exports.AgendasApiController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agenda_entity_1 = require("../entities/agenda.entity");
const agenda_service_1 = require("./agenda.service");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let AgendasApiController = class AgendasApiController {
    constructor(agendaRepository, agendaService) {
        this.agendaRepository = agendaRepository;
        this.agendaService = agendaService;
    }
    async getAll(req, page = 1, limit = 30) {
        const pageNum = typeof page === "string" ? parseInt(page, 10) : page || 1;
        const limitNum = typeof limit === "string" ? parseInt(limit, 10) : limit || 30;
        const skip = (pageNum - 1) * limitNum;
        const queryOptions = {
            skip,
            take: limitNum,
            order: { date_debut: "DESC" },
            relations: ["stagiaire"],
        };
        if (req.user.role === "stagiaire") {
            const stagiaireId = req.user.stagiaire?.id;
            if (stagiaireId) {
                queryOptions.where = { stagiaire_id: stagiaireId };
            }
            else {
                return {
                    "@context": "/api/contexts/Agenda",
                    "@id": "/api/agendas",
                    "@type": "Collection",
                    member: [],
                    totalItems: 0,
                };
            }
        }
        const [data, total] = await this.agendaRepository.findAndCount(queryOptions);
        const members = data.map((item) => this.agendaService.formatAgendaJsonLd(item));
        return {
            "@context": "/api/contexts/Agenda",
            "@id": "/api/agendas",
            "@type": "Collection",
            member: members,
            totalItems: total,
        };
    }
    async create(body) {
        const agenda = this.agendaRepository.create({
            titre: body.titre,
            description: body.description,
            date_debut: body.date_debut ? new Date(body.date_debut) : null,
            date_fin: body.date_fin ? new Date(body.date_fin) : null,
            evenement: body.evenement,
            commentaire: body.commentaire,
            stagiaire_id: body.stagiaire_id,
        });
        const saved = await this.agendaRepository.save(agenda);
        return this.agendaService.formatAgendaJsonLd(saved);
    }
    async getOne(id) {
        const agenda = await this.agendaRepository.findOne({
            where: { id },
        });
        if (!agenda) {
            throw new common_1.NotFoundException("Agenda non trouvé");
        }
        return this.agendaService.formatAgendaJsonLd(agenda);
    }
    async update(id, body) {
        const agenda = await this.agendaRepository.findOne({
            where: { id },
        });
        if (!agenda) {
            throw new common_1.NotFoundException("Agenda non trouvé");
        }
        Object.assign(agenda, {
            titre: body.titre ?? agenda.titre,
            description: body.description ?? agenda.description,
            date_debut: body.date_debut
                ? new Date(body.date_debut)
                : agenda.date_debut,
            date_fin: body.date_fin ? new Date(body.date_fin) : agenda.date_fin,
            evenement: body.evenement ?? agenda.evenement,
            commentaire: body.commentaire ?? agenda.commentaire,
            stagiaire_id: body.stagiaire_id ?? agenda.stagiaire_id,
        });
        const updated = await this.agendaRepository.save(agenda);
        return this.agendaService.formatAgendaJsonLd(updated);
    }
    async delete(id) {
        const agenda = await this.agendaRepository.findOne({
            where: { id },
        });
        if (!agenda) {
            throw new common_1.NotFoundException("Agenda non trouvé");
        }
        await this.agendaRepository.remove(agenda);
        return { id, message: "Agenda supprimé avec succès" };
    }
};
exports.AgendasApiController = AgendasApiController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], AgendasApiController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgendasApiController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AgendasApiController.prototype, "getOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AgendasApiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AgendasApiController.prototype, "delete", null);
exports.AgendasApiController = AgendasApiController = __decorate([
    (0, common_1.Controller)("agendas"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin", "formateur", "formatrice", "commercial", "stagiaire"),
    __param(0, (0, typeorm_1.InjectRepository)(agenda_entity_1.Agenda)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        agenda_service_1.AgendaService])
], AgendasApiController);
//# sourceMappingURL=agendas-api.controller.js.map