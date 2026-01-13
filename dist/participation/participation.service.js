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
exports.ParticipationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const participation_entity_1 = require("../entities/participation.entity");
let ParticipationService = class ParticipationService {
    constructor(participationRepository) {
        this.participationRepository = participationRepository;
    }
    async findAll(page = 1, perPage = 20, baseUrl = "") {
        const [data, total] = await this.participationRepository
            .createQueryBuilder("p")
            .skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();
        const formattedData = data.map((p) => ({
            "@id": `/api/participations/${p.id}`,
            "@type": "Participation",
            id: p.id,
            stagiaire_id: `/api/stagiaires/${p.stagiaire_id}`,
            quiz_id: `/api/quizzes/${p.quiz_id}`,
            date: p.date,
            heure: p.heure,
            score: p.score,
            deja_jouer: p.deja_jouer,
            current_question_id: p.current_question_id,
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
        const p = await this.participationRepository.findOne({
            where: { id },
        });
        if (!p)
            return null;
        return {
            "@context": "/api/contexts/Participation",
            "@id": `/api/participations/${p.id}`,
            "@type": "Participation",
            id: p.id,
            stagiaire_id: `/api/stagiaires/${p.stagiaire_id}`,
            quiz_id: `/api/quizzes/${p.quiz_id}`,
            date: p.date,
            heure: p.heure,
            score: p.score,
            deja_jouer: p.deja_jouer,
            current_question_id: p.current_question_id,
            created_at: p.created_at?.toISOString(),
            updated_at: p.updated_at?.toISOString(),
        };
    }
};
exports.ParticipationService = ParticipationService;
exports.ParticipationService = ParticipationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(participation_entity_1.Participation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ParticipationService);
//# sourceMappingURL=participation.service.js.map