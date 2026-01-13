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
exports.ProgressionController = void 0;
const common_1 = require("@nestjs/common");
const progression_service_1 = require("./progression.service");
let ProgressionController = class ProgressionController {
    constructor(progressionService) {
        this.progressionService = progressionService;
    }
    async findAll(page = "1", req) {
        const pageNum = parseInt(page) || 1;
        const baseUrl = `${req.protocol}://${req.get("host")}/api/progressions`;
        return this.progressionService.findAll(pageNum, 10, baseUrl);
    }
    async findOne(id) {
        const progression = await this.progressionService.findOne(id);
        if (!progression) {
            throw new common_1.NotFoundException("Progression not found");
        }
        return progression;
    }
};
exports.ProgressionController = ProgressionController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProgressionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProgressionController.prototype, "findOne", null);
exports.ProgressionController = ProgressionController = __decorate([
    (0, common_1.Controller)("progressions"),
    __metadata("design:paramtypes", [progression_service_1.ProgressionService])
], ProgressionController);
//# sourceMappingURL=progression.controller.js.map