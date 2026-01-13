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
exports.ProgressionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const progression_entity_1 = require("../entities/progression.entity");
let ProgressionService = class ProgressionService {
    constructor(progressionRepository) {
        this.progressionRepository = progressionRepository;
    }
    async findAll(page = 1, perPage = 10, baseUrl = "") {
        const [data, total] = await this.progressionRepository
            .createQueryBuilder("p")
            .skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();
        const formattedData = data.map((p) => ({
            "@id": `/api/progressions/${p.id}`,
            "@type": "Progression",
            id: p.id,
            termine: p.termine,
            stagiaire_id: `/api/stagiaires/${p.stagiaire_id}`,
            quiz_id: p.quiz_id ? `/api/quizzes/${p.quiz_id}` : null,
            formation_id: p.formation_id ? `/api/formations/${p.formation_id}` : null,
            pourcentage: p.pourcentage,
            explication: p.explication,
            score: p.score,
            correct_answers: p.correct_answers,
            total_questions: p.total_questions,
            time_spent: p.time_spent,
            completion_time: p.completion_time?.toISOString(),
            created_at: p.created_at?.toISOString(),
            updated_at: p.updated_at?.toISOString(),
        }));
        return {
            member: formattedData,
            totalItems: total,
            "hydra:view": {
                "@id": `${baseUrl}?page=${page}`,
                "@type": "hydra:PartialCollectionView",
                "hydra:first": `${baseUrl}?page=1`,
                "hydra:last": `${baseUrl}?page=${Math.ceil(total / perPage)}`,
                "hydra:next": page < Math.ceil(total / perPage)
                    ? `${baseUrl}?page=${page + 1}`
                    : undefined,
                "hydra:previous": page > 1 ? `${baseUrl}?page=${page - 1}` : undefined,
            },
        };
    }
    async findOne(id) {
        const p = await this.progressionRepository.findOne({
            where: { id },
        });
        if (!p)
            return null;
        return {
            "@context": "/api/contexts/Progression",
            "@id": `/api/progressions/${p.id}`,
            "@type": "Progression",
            id: p.id,
            termine: p.termine,
            stagiaire_id: `/api/stagiaires/${p.stagiaire_id}`,
            quiz_id: p.quiz_id ? `/api/quizzes/${p.quiz_id}` : null,
            formation_id: p.formation_id ? `/api/formations/${p.formation_id}` : null,
            pourcentage: p.pourcentage,
            explication: p.explication,
            score: p.score,
            correct_answers: p.correct_answers,
            total_questions: p.total_questions,
            time_spent: p.time_spent,
            completion_time: p.completion_time?.toISOString(),
            created_at: p.created_at?.toISOString(),
            updated_at: p.updated_at?.toISOString(),
        };
    }
};
exports.ProgressionService = ProgressionService;
exports.ProgressionService = ProgressionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(progression_entity_1.Progression)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProgressionService);
//# sourceMappingURL=progression.service.js.map