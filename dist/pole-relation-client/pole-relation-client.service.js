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
exports.PoleRelationClientService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pole_relation_client_entity_1 = require("../entities/pole-relation-client.entity");
let PoleRelationClientService = class PoleRelationClientService {
    constructor(prcRepository) {
        this.prcRepository = prcRepository;
    }
    async findAll(page = 1, perPage = 10, baseUrl = "") {
        const [data, total] = await this.prcRepository
            .createQueryBuilder("p")
            .skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();
        const formattedData = data.map((p) => ({
            "@id": `/api/pole_relation_clients/${p.id}`,
            "@type": "PoleRelationClient",
            id: p.id,
            role: p.role,
            stagiaire_id: p.stagiaire_id,
            user_id: p.user_id ? `/api/users/${p.user_id}` : null,
            prenom: p.prenom,
            telephone: p.telephone,
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
        const p = await this.prcRepository.findOne({
            where: { id },
        });
        if (!p)
            return null;
        return {
            "@context": "/api/contexts/PoleRelationClient",
            "@id": `/api/pole_relation_clients/${p.id}`,
            "@type": "PoleRelationClient",
            id: p.id,
            role: p.role,
            stagiaire_id: p.stagiaire_id,
            user_id: p.user_id ? `/api/users/${p.user_id}` : null,
            prenom: p.prenom,
            telephone: p.telephone,
            created_at: p.created_at?.toISOString(),
            updated_at: p.updated_at?.toISOString(),
        };
    }
};
exports.PoleRelationClientService = PoleRelationClientService;
exports.PoleRelationClientService = PoleRelationClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pole_relation_client_entity_1.PoleRelationClient)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PoleRelationClientService);
//# sourceMappingURL=pole-relation-client.service.js.map