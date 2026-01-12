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
const media_stagiaire_entity_1 = require("../entities/media-stagiaire.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const achievement_service_1 = require("../achievement/achievement.service");
let MediaService = class MediaService {
    constructor(mediaRepository, mediaStagiaireRepository, stagiaireRepository, achievementService) {
        this.mediaRepository = mediaRepository;
        this.mediaStagiaireRepository = mediaStagiaireRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.achievementService = achievementService;
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
    async findByCategoriePaginated(categorie, page = 1, perPage = 10, baseUrl = "https://localhost:3000/api/medias/astuces", userId) {
        const query = this.mediaRepository
            .createQueryBuilder("m")
            .where("m.categorie = :categorie", { categorie })
            .orderBy("m.id", "DESC");
        if (userId) {
            query.leftJoinAndSelect("m.mediaStagiaires", "ms", "ms.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)", { userId });
        }
        const [data, total] = await query
            .skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();
        const lastPage = Math.ceil(total / perPage);
        const formattedData = data.map((media) => this.formatMedia(media));
        return {
            current_page: page,
            data: formattedData,
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
    async findByFormationAndCategorie(formationId, categorie, page = 1, perPage = 10, baseUrl = "", userId) {
        const query = this.mediaRepository
            .createQueryBuilder("m")
            .where("m.formation_id = :formationId", { formationId })
            .andWhere("m.categorie = :categorie", { categorie })
            .orderBy("m.id", "DESC");
        if (userId) {
            query.leftJoinAndSelect("m.mediaStagiaires", "ms", "ms.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)", { userId });
        }
        const [data, total] = await query
            .skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();
        const lastPage = Math.ceil(total / perPage);
        const formattedData = data.map((media) => this.formatMedia(media));
        return {
            current_page: page,
            data: formattedData,
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
    async markAsWatched(mediaId, userId) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
        });
        if (!stagiaire) {
            throw new Error("Stagiaire not found");
        }
        let mediaStagiaire = await this.mediaStagiaireRepository.findOne({
            where: { media_id: mediaId, stagiaire_id: stagiaire.id },
        });
        if (mediaStagiaire) {
            mediaStagiaire.is_watched = true;
            mediaStagiaire.watched_at = new Date();
            await this.mediaStagiaireRepository.save(mediaStagiaire);
        }
        else {
            mediaStagiaire = this.mediaStagiaireRepository.create({
                media_id: mediaId,
                stagiaire_id: stagiaire.id,
                is_watched: true,
                watched_at: new Date(),
            });
            await this.mediaStagiaireRepository.save(mediaStagiaire);
        }
        const newAchievements = await this.achievementService.checkAchievements(stagiaire.id);
        return {
            message: "Media marked as watched",
            new_achievements: newAchievements,
        };
    }
    formatMedia(media) {
        return {
            id: media.id,
            titre: media.titre,
            description: media.description,
            url: media.url,
            size: media.size,
            mime: media.mime,
            uploaded_by: media.uploaded_by,
            video_platform: media.video_platform || "server",
            video_file_path: media.video_file_path,
            subtitle_file_path: media.subtitle_file_path,
            subtitle_language: media.subtitle_language || "fr",
            type: media.type || "video",
            categorie: media.categorie,
            duree: media.duree,
            ordre: media.ordre,
            formation_id: media.formation_id,
            created_at: media.created_at?.toISOString(),
            updated_at: media.updated_at?.toISOString(),
            video_url: media.video_url,
            subtitle_url: media.subtitle_url,
            stagiaires: (media.mediaStagiaires || []).map((ms) => ({
                id: ms.stagiaire_id,
                is_watched: ms.is_watched ? 1 : 0,
                watched_at: ms.watched_at,
                pivot: {
                    media_id: media.id,
                    stagiaire_id: ms.stagiaire_id,
                    is_watched: ms.is_watched ? 1 : 0,
                    watched_at: ms.watched_at,
                    created_at: ms.created_at,
                    updated_at: ms.updated_at,
                },
            })),
        };
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(media_entity_1.Media)),
    __param(1, (0, typeorm_1.InjectRepository)(media_stagiaire_entity_1.MediaStagiaire)),
    __param(2, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        achievement_service_1.AchievementService])
], MediaService);
//# sourceMappingURL=media.service.js.map