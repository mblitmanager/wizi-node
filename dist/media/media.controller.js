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
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const media_service_1 = require("./media.service");
let MediaController = class MediaController {
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    findAll() {
        return this.mediaService.findAll();
    }
    async getServerMedias(page = "1", req) {
        const pageNum = parseInt(page) || 1;
        const baseUrl = `${req.protocol}://${req.get("host")}/api/medias/server`;
        return this.mediaService.getServerMediasPaginated(pageNum, 20, baseUrl);
    }
    async getTutoriels(page = "1", req) {
        const pageNum = parseInt(page) || 1;
        const baseUrl = `${req.protocol}://${req.get("host")}/api/medias/tutoriels`;
        const userId = req.user?.id;
        return this.mediaService.findByCategoriePaginated("tutoriel", pageNum, 10, baseUrl, userId);
    }
    async getAstuces(page = "1", req) {
        const pageNum = parseInt(page) || 1;
        const baseUrl = `${req.protocol}://${req.get("host")}/api/medias/astuces`;
        const userId = req.user?.id;
        return this.mediaService.findByCategoriePaginated("astuce", pageNum, 10, baseUrl, userId);
    }
    async getTutorielsByFormation(formationId, req, page = "1") {
        const pageNum = parseInt(page) || 1;
        const userId = req.user?.id;
        const baseUrl = `${req.protocol}://${req.get("host")}/api/medias/formations/${formationId}/tutoriels`;
        return this.mediaService.findByFormationAndCategorie(formationId, "tutoriel", pageNum, 10, baseUrl, userId);
    }
    async getAstucesByFormation(formationId, req, page = "1") {
        const pageNum = parseInt(page) || 1;
        const userId = req.user?.id;
        const baseUrl = `${req.protocol}://${req.get("host")}/api/medias/formations/${formationId}/astuces`;
        return this.mediaService.findByFormationAndCategorie(formationId, "astuce", pageNum, 10, baseUrl, userId);
    }
    async getInteractivesFormations() {
        return this.mediaService.getInteractivesFormations();
    }
    async getFormationsWithStatus() {
        return this.mediaService.getFormationsWithStatus();
    }
    async updateProgress(req, data) {
        return this.mediaService.updateProgress(data.media_id, req.user.id, data.current_time, data.duration);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("server"),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getServerMedias", null);
__decorate([
    (0, common_1.Get)("tutoriels"),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getTutoriels", null);
__decorate([
    (0, common_1.Get)("astuces"),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getAstuces", null);
__decorate([
    (0, common_1.Get)("formations/:formationId/tutoriels"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(0, (0, common_1.Param)("formationId")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)("page")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getTutorielsByFormation", null);
__decorate([
    (0, common_1.Get)("formations/:formationId/astuces"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(0, (0, common_1.Param)("formationId")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)("page")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getAstucesByFormation", null);
__decorate([
    (0, common_1.Get)("formations/interactives"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getInteractivesFormations", null);
__decorate([
    (0, common_1.Get)("formations-with-status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getFormationsWithStatus", null);
__decorate([
    (0, common_1.Post)("updateProgress"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "updateProgress", null);
exports.MediaController = MediaController = __decorate([
    (0, common_1.Controller)("medias"),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map