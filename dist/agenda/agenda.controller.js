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
exports.AgendaController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const agenda_service_1 = require("./agenda.service");
let AgendaController = class AgendaController {
    constructor(agendaService) {
        this.agendaService = agendaService;
    }
    async getAgenda(req) {
        try {
            return await this.agendaService.getStagiaireAgenda(req.user.id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async exportAgenda(req, res) {
        try {
            const ics = await this.agendaService.exportAgendaToICS(req.user.id);
            res.setHeader("Content-Type", "text/calendar");
            res.setHeader("Content-Disposition", 'attachment; filename="agenda.ics"');
            return res.send(ics);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getNotifications(req) {
        try {
            return await this.agendaService.getStagiaireNotifications(req.user.id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async markAsRead(id) {
        try {
            const success = await this.agendaService.markNotificationAsRead(id);
            return { success };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async markAllAsRead(req) {
        try {
            const success = await this.agendaService.markAllNotificationsAsRead(req.user.id);
            return { success };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AgendaController = AgendaController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgendaController.prototype, "getAgenda", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("export"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AgendaController.prototype, "exportAgenda", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("notifications"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgendaController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Put)("notifications/:id/read"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AgendaController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Put)("notifications/read-all"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgendaController.prototype, "markAllAsRead", null);
exports.AgendaController = AgendaController = __decorate([
    (0, common_1.Controller)("stagiaire/agenda"),
    __metadata("design:paramtypes", [agenda_service_1.AgendaService])
], AgendaController);
//# sourceMappingURL=agenda.controller.js.map