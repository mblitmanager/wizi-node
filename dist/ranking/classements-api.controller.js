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
exports.ClassementsApiController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const ranking_service_1 = require("./ranking.service");
let ClassementsApiController = class ClassementsApiController {
    constructor(rankingService) {
        this.rankingService = rankingService;
    }
    async getAll(page = "1", limit = "10", formationId) {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const { items, total } = await this.rankingService.findAllPaginated(pageNum, limitNum, formationId);
        const members = items.map((c) => ({
            "@id": `/api/classements/${c.id}`,
            "@type": "Classement",
            id: c.id,
            rang: c.rang,
            points: c.points?.toString() || "0",
            createdAt: c.created_at?.toISOString().replace("Z", "+00:00"),
            updatedAt: c.updated_at?.toISOString().replace("Z", "+00:00"),
            stagiaire: `/api/stagiaires/${c.stagiaire_id}`,
            quiz: `/api/quizzes/${c.quiz_id}`,
        }));
        const lastPage = Math.ceil(total / limitNum);
        return {
            "@context": "/api/contexts/Classement",
            "@id": "/api/classements",
            "@type": "Collection",
            totalItems: total,
            member: members,
            view: {
                "@id": `/api/classements?page=${pageNum}`,
                "@type": "PartialCollectionView",
                first: `/api/classements?page=1`,
                last: `/api/classements?page=${lastPage}`,
                next: pageNum < lastPage ? `/api/classements?page=${pageNum + 1}` : null,
            },
        };
    }
};
exports.ClassementsApiController = ClassementsApiController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("formation_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], ClassementsApiController.prototype, "getAll", null);
exports.ClassementsApiController = ClassementsApiController = __decorate([
    (0, common_1.Controller)("classements"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [ranking_service_1.RankingService])
], ClassementsApiController);
//# sourceMappingURL=classements-api.controller.js.map