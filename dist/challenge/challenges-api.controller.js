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
exports.ChallengesApiController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const challenge_service_1 = require("./challenge.service");
let ChallengesApiController = class ChallengesApiController {
    constructor(challengeService) {
        this.challengeService = challengeService;
    }
    async getAll(page = "1", limit = "10") {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const { items, total } = await this.challengeService.findAll(pageNum, limitNum);
        const members = items.map((c) => this.challengeService.formatChallengeJsonLd(c));
        const lastPage = Math.ceil(total / limitNum);
        return {
            "@context": "/api/contexts/Challenge",
            "@id": "/api/challenges",
            "@type": "Collection",
            totalItems: total,
            member: members,
            view: {
                "@id": `/api/challenges?page=${pageNum}`,
                "@type": "PartialCollectionView",
                first: `/api/challenges?page=1`,
                last: `/api/challenges?page=${lastPage}`,
                next: pageNum < lastPage ? `/api/challenges?page=${pageNum + 1}` : null,
            },
        };
    }
    async getOne(id) {
        const challenge = await this.challengeService.findOne(id);
        if (!challenge) {
            throw new common_1.NotFoundException(`Challenge with ID ${id} not found`);
        }
        return this.challengeService.formatChallengeJsonLd(challenge);
    }
    async create(data) {
        const challenge = await this.challengeService.create(data);
        return this.challengeService.formatChallengeJsonLd(challenge);
    }
    async update(id, data) {
        const challenge = await this.challengeService.update(id, data);
        if (!challenge) {
            throw new common_1.NotFoundException(`Challenge with ID ${id} not found`);
        }
        return this.challengeService.formatChallengeJsonLd(challenge);
    }
    async delete(id) {
        await this.challengeService.delete(id);
        return null;
    }
};
exports.ChallengesApiController = ChallengesApiController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChallengesApiController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChallengesApiController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChallengesApiController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ChallengesApiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChallengesApiController.prototype, "delete", null);
exports.ChallengesApiController = ChallengesApiController = __decorate([
    (0, common_1.Controller)("challenges"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [challenge_service_1.ChallengeService])
], ChallengesApiController);
//# sourceMappingURL=challenges-api.controller.js.map