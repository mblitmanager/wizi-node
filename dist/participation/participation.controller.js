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
exports.ParticipationController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const participation_service_1 = require("./participation.service");
let ParticipationController = class ParticipationController {
    constructor(participationService) {
        this.participationService = participationService;
    }
    async findAll(page = "1", req) {
        const pageNum = parseInt(page) || 1;
        const baseUrl = `${req.protocol}://${req.get("host")}/api/participations`;
        return this.participationService.findAll(pageNum, 30, baseUrl);
    }
    async findOne(id) {
        const participation = await this.participationService.findOne(id);
        if (!participation) {
            throw new common_1.NotFoundException("Participation not found");
        }
        return participation;
    }
};
exports.ParticipationController = ParticipationController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ParticipationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ParticipationController.prototype, "findOne", null);
exports.ParticipationController = ParticipationController = __decorate([
    (0, common_1.Controller)("participations"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [participation_service_1.ParticipationService])
], ParticipationController);
//# sourceMappingURL=participation.controller.js.map