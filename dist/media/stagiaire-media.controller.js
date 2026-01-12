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
exports.StagiaireMediaController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const media_service_1 = require("./media.service");
let StagiaireMediaController = class StagiaireMediaController {
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    async watched(id, req) {
        const userId = req.user.id;
        return this.mediaService.markAsWatched(id, userId);
    }
};
exports.StagiaireMediaController = StagiaireMediaController;
__decorate([
    (0, common_1.Post)(":id/watched"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StagiaireMediaController.prototype, "watched", null);
exports.StagiaireMediaController = StagiaireMediaController = __decorate([
    (0, common_1.Controller)("medias"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], StagiaireMediaController);
//# sourceMappingURL=stagiaire-media.controller.js.map