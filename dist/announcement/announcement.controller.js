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
exports.AnnouncementController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const announcement_service_1 = require("./announcement.service");
let AnnouncementController = class AnnouncementController {
    constructor(announcementService) {
        this.announcementService = announcementService;
    }
    async index(req, page = 1, limit = 10) {
        try {
            return await this.announcementService.getAnnouncements(req.user, page, limit);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async store(req, body) {
        try {
            return await this.announcementService.createAnnouncement(body, req.user);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRecipients(req) {
        try {
            return await this.announcementService.getPotentialRecipients(req.user);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async destroy(req, id) {
        try {
            return await this.announcementService.deleteAnnouncement(id, req.user);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Internal error", error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AnnouncementController = AnnouncementController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "index", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "store", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Get)("recipients"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "getRecipients", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "destroy", null);
exports.AnnouncementController = AnnouncementController = __decorate([
    (0, common_1.Controller)("announcements"),
    __metadata("design:paramtypes", [announcement_service_1.AnnouncementService])
], AnnouncementController);
//# sourceMappingURL=announcement.controller.js.map