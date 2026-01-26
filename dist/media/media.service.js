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
const formation_entity_1 = require("../entities/formation.entity");
const achievement_service_1 = require("../achievement/achievement.service");
let MediaService = class MediaService {
    constructor(mediaRepository, mediaStagiaireRepository, stagiaireRepository, formationRepository, achievementService) {
        this.mediaRepository = mediaRepository;
        this.mediaStagiaireRepository = mediaStagiaireRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.formationRepository = formationRepository;
        this.achievementService = achievementService;
    }
    async getServerMediasPaginated(page = 1, perPage = 20, baseUrl = "") {
        const [data, total] = await this.mediaRepository
            .createQueryBuilder("m")
            .orderBy("m.id", "DESC")
            .skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();
        const formattedData = data.map((m) => ({
            id: m.id,
            titre: m.titre,
            description: m.description,
            url: m.url,
            size: m.size,
            mime: m.mime,
            uploaded_by: m.uploaded_by,
            created_at: this.formatIso(m.created_at),
        }));
        return this.formatPagination(formattedData, total, page, perPage, baseUrl);
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
    async getTutorials(userId) {
        const query = this.mediaRepository
            .createQueryBuilder("m")
            .where("m.categorie = :categorie", { categorie: "tutoriel" })
            .orderBy("m.id", "DESC");
        if (userId) {
            query.leftJoinAndSelect("m.mediaStagiaires", "ms", "ms.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)", { userId });
        }
        const data = await query.getMany();
        return data.map((media) => this.formatMedia(media));
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
        const formattedData = data.map((media) => this.formatMedia(media));
        return this.formatPagination(formattedData, total, page, perPage, baseUrl);
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
    async findByFilePath(filename) {
        return this.mediaRepository.findOne({
            where: [{ video_file_path: filename }, { url: (0, typeorm_2.Like)(`%${filename}%`) }],
        });
    }
    async findByFormationAndCategorie(formationId, categorie, page = 1, perPage = 10, baseUrl = "", userId) {
        const query = this.mediaRepository
            .createQueryBuilder("m")
            .where("m.formation_id = :formationId", { formationId })
            .andWhere("m.categorie = :categorie", { categorie })
            .orderBy("m.id", "DESC");
        if (userId) {
            query
                .leftJoinAndSelect("m.mediaStagiaires", "ms")
                .leftJoinAndSelect("ms.stagiaire", "s");
        }
        const [data, total] = await query
            .skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();
        const formattedData = data.map((media) => this.formatMedia(media));
        return this.formatPagination(formattedData, total, page, perPage, baseUrl);
    }
    formatPagination(data, total, page, perPage, baseUrl) {
        const lastPage = Math.max(1, Math.ceil(total / perPage));
        return {
            current_page: String(page).match(/^\d+$/) ? Number(page) : 1,
            data,
            first_page_url: `${baseUrl}?page=1`,
            from: total > 0 ? (page - 1) * perPage + 1 : null,
            last_page: lastPage,
            last_page_url: `${baseUrl}?page=${lastPage}`,
            links: this.generateLinks(page, lastPage, baseUrl),
            next_page_url: page < lastPage ? `${baseUrl}?page=${page + 1}` : null,
            path: baseUrl,
            per_page: perPage,
            prev_page_url: page > 1 ? `${baseUrl}?page=${page - 1}` : null,
            to: total > 0 ? Math.min(page * perPage, total) : null,
            total,
        };
    }
    async getInteractivesFormations() {
        const formations = await this.formationRepository
            .createQueryBuilder("f")
            .leftJoinAndSelect("f.medias", "m")
            .orderBy("f.id", "ASC")
            .getMany();
        return formations.map((f) => {
            const allMedias = (f.medias || []).map((m) => this.formatMedia(m, false));
            return {
                id: f.id,
                title: null,
                description: f.description,
                duration: null,
                tutoriels: allMedias.filter((m) => m.categorie === "tutoriel"),
                astuces: allMedias.filter((m) => m.categorie === "astuce"),
            };
        });
    }
    async getFormationsWithStatus() {
        const formations = await this.formationRepository
            .createQueryBuilder("f")
            .leftJoinAndSelect("f.medias", "m")
            .leftJoinAndSelect("m.mediaStagiaires", "ms")
            .leftJoinAndSelect("ms.stagiaire", "s")
            .orderBy("f.id", "ASC")
            .getMany();
        return formations.map((f) => ({
            id: f.id,
            titre: f.titre,
            slug: f.slug,
            description: f.description,
            statut: f.statut,
            duree: f.duree,
            categorie: f.categorie,
            image: f.image,
            icon: f.icon,
            created_at: this.formatIso(f.created_at),
            updated_at: this.formatIso(f.updated_at),
            medias: (f.medias || []).map((m) => this.formatMedia(m)),
        }));
    }
    async updateProgress(mediaId, userId, currentTime, duration) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
        });
        if (!stagiaire) {
            throw new Error("Stagiaire not found");
        }
        let mediaStagiaire = await this.mediaStagiaireRepository.findOne({
            where: { media_id: mediaId, stagiaire_id: stagiaire.id },
        });
        const percentage = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
        const isWatched = percentage >= 90;
        if (mediaStagiaire) {
            mediaStagiaire.current_time = currentTime;
            mediaStagiaire.duration = duration;
            if (isWatched) {
                mediaStagiaire.is_watched = true;
                mediaStagiaire.watched_at = new Date();
            }
            await this.mediaStagiaireRepository.save(mediaStagiaire);
        }
        else {
            mediaStagiaire = this.mediaStagiaireRepository.create({
                media_id: mediaId,
                stagiaire_id: stagiaire.id,
                current_time: currentTime,
                duration: duration,
                is_watched: isWatched,
                watched_at: isWatched ? new Date() : null,
            });
            await this.mediaStagiaireRepository.save(mediaStagiaire);
        }
        if (isWatched) {
            await this.achievementService.checkAchievements(stagiaire.id);
        }
        return mediaStagiaire;
    }
    async markAsWatched(mediaId, userId) {
        return this.updateProgress(mediaId, userId, 100, 100);
    }
    formatMedia(media, includeStagiaires = true) {
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
            created_at: this.formatIso(media.created_at),
            updated_at: this.formatIso(media.updated_at),
            video_url: media.video_platform === "server" && media.video_file_path
                ? `/api/medias/stream/${media.video_file_path}`
                : media.video_url || media.url || null,
            subtitle_url: media.subtitle_file_path
                ? `/api/medias/subtitles/${media.subtitle_file_path}`
                : null,
            ...(includeStagiaires && {
                stagiaires: (media.mediaStagiaires || [])
                    .map((ms) => {
                    const s = ms.stagiaire;
                    if (!s)
                        return null;
                    return {
                        id: s.id,
                        prenom: s.prenom,
                        civilite: s.civilite,
                        telephone: s.telephone,
                        adresse: s.adresse,
                        date_naissance: this.formatDateOnly(s.date_naissance),
                        ville: s.ville,
                        code_postal: s.code_postal,
                        date_debut_formation: this.formatDateOnly(s.date_debut_formation),
                        date_inscription: this.formatDateOnly(s.date_inscription),
                        role: s.role,
                        statut: s.statut,
                        user_id: s.user_id,
                        deleted_at: null,
                        created_at: this.formatIso(s.created_at),
                        updated_at: this.formatIso(s.updated_at),
                        date_fin_formation: this.formatDateOnly(s.date_fin_formation),
                        login_streak: s.login_streak,
                        last_login_at: this.formatDateTime(s.last_login_at),
                        onboarding_seen: s.onboarding_seen ? 1 : 0,
                        partenaire_id: s.partenaire_id,
                        pivot: {
                            media_id: media.id,
                            stagiaire_id: s.id,
                            is_watched: ms.is_watched ? 1 : 0,
                            watched_at: this.formatDateTime(ms.watched_at),
                            created_at: null,
                            updated_at: this.formatIso(ms.updated_at),
                        },
                    };
                })
                    .filter(Boolean),
            }),
        };
    }
    formatIso(date) {
        if (!date)
            return null;
        const d = new Date(date);
        if (isNaN(d.getTime()))
            return null;
        return d.toISOString().replace(".000Z", ".000000Z");
    }
    formatDateOnly(date) {
        if (!date)
            return null;
        if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date))
            return date;
        const d = new Date(date);
        if (isNaN(d.getTime()))
            return null;
        return d.toISOString().split("T")[0];
    }
    formatDateTime(date) {
        if (!date)
            return null;
        const d = new Date(date);
        if (isNaN(d.getTime()))
            return null;
        return d.toISOString().split(".")[0].replace("T", " ");
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(media_entity_1.Media)),
    __param(1, (0, typeorm_1.InjectRepository)(media_stagiaire_entity_1.MediaStagiaire)),
    __param(2, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(3, (0, typeorm_1.InjectRepository)(formation_entity_1.Formation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        achievement_service_1.AchievementService])
], MediaService);
//# sourceMappingURL=media.service.js.map