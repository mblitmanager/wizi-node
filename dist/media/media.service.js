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
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const media_entity_1 = require("../entities/media.entity");
let MediaService = class MediaService {
    constructor(mediaRepository) {
        this.mediaRepository = mediaRepository;
    }
    async findAll() {
        return this.mediaRepository.find();
    }
    async findByType(type) {
        return this.mediaRepository.find({
            where: { type },
            order: { created_at: "DESC" },
        });
    }
    async findByCategoriePaginated(categorie, page = 1, perPage = 10, baseUrl = "https://localhost:3000/api/medias/astuces") {
        const query = this.mediaRepository.createQueryBuilder("m")
            .where("m.categorie = :categorie", { categorie })
            .orderBy("m.id", "DESC");
        const [data, total] = await query
            .skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();
        const lastPage = Math.ceil(total / perPage);
        return {
            current_page: page,
            data,
            first_page_url: `${baseUrl}?page=1`,
            from: (page - 1) * perPage + 1,
            last_page: lastPage,
            last_page_url: `${baseUrl}?page=${lastPage}`,
            links: this.generateLinks(page, lastPage, baseUrl),
            next_page_url: page < lastPage ? `${baseUrl}?page=${page + 1}` : null,
            path: baseUrl,
            per_page: perPage,
            prev_page_url: page > 1 ? `${baseUrl}?page=${page - 1}` : null,
            to: Math.min(page * perPage, total),
            total,
        };
    }
    generateLinks(currentPage, lastPage, baseUrl) {
        const links = [];
        links.push({
            url: currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : null,
            label: "pagination.previous",
            active: false,
        });
        for (let i = 1; i <= lastPage; i++) {
            links.push({
                url: `${baseUrl}?page=${i}`,
                label: i.toString(),
                active: i === currentPage,
            });
        }
        links.push({
            url: currentPage < lastPage ? `${baseUrl}?page=${currentPage + 1}` : null,
            label: "pagination.next",
            active: false,
        });
        return links;
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(media_entity_1.Media)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MediaService);
//# sourceMappingURL=media.service.js.map