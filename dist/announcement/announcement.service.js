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
exports.AnnouncementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const announcement_entity_1 = require("../entities/announcement.entity");
const user_entity_1 = require("../entities/user.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const formateur_entity_1 = require("../entities/formateur.entity");
const commercial_entity_1 = require("../entities/commercial.entity");
const notification_service_1 = require("../notification/notification.service");
let AnnouncementService = class AnnouncementService {
    constructor(announcementRepository, userRepository, stagiaireRepository, formateurRepository, commercialRepository, notificationService) {
        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.formateurRepository = formateurRepository;
        this.commercialRepository = commercialRepository;
        this.notificationService = notificationService;
    }
    async getAnnouncements(user, page = 1, limit = 10) {
        const query = this.announcementRepository
            .createQueryBuilder("announcement")
            .leftJoinAndSelect("announcement.creator", "creator")
            .orderBy("announcement.created_at", "DESC");
        if (user.role !== "admin") {
            query.where("announcement.created_by = :userId", { userId: user.id });
        }
        const [items, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data: items,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / limit),
            },
        };
    }
    async createAnnouncement(data, user) {
        const { title, message, target_audience, recipient_ids, scheduled_at } = data;
        if (user.role === "formateur" ||
            user.role === "formatrice" ||
            user.role === "commercial") {
            if (!["stagiaires", "specific_users"].includes(target_audience)) {
                throw new common_1.ForbiddenException("Vous ne pouvez envoyer des annonces qu'aux stagiaires ou à des utilisateurs spécifiques.");
            }
        }
        let filteredIds = null;
        if (target_audience === "specific_users") {
            const allowedUsers = await this.getScopedStagiaireUsers(user);
            const allowedIds = allowedUsers.map((u) => u.id);
            if (user.role !== "admin") {
                filteredIds = recipient_ids.filter((id) => allowedIds.includes(id));
            }
            else {
                filteredIds = recipient_ids;
            }
        }
        const announcement = this.announcementRepository.create({
            title,
            message,
            target_audience,
            recipient_ids: filteredIds,
            created_by: user.id,
            scheduled_at: scheduled_at ? new Date(scheduled_at) : null,
            sent_at: scheduled_at ? null : new Date(),
            status: scheduled_at ? "scheduled" : "sent",
        });
        const savedAnnouncement = await this.announcementRepository.save(announcement);
        if (!scheduled_at) {
            const recipients = await this.getRecipientsForImmediateSend(target_audience, filteredIds, user);
            for (const recipient of recipients) {
                await this.notificationService.createNotification(recipient.id, "announcement", message, { type: "announcement", announcement_id: savedAnnouncement.id }, title);
            }
            return {
                message: "Annonce créée et envoi démarré.",
                announcement: savedAnnouncement,
                recipients_count: recipients.length,
            };
        }
        return {
            message: "Annonce planifiée avec succès.",
            announcement: savedAnnouncement,
        };
    }
    async deleteAnnouncement(id, user) {
        const announcement = await this.announcementRepository.findOne({
            where: { id },
        });
        if (!announcement) {
            throw new common_1.NotFoundException("Annonce introuvable.");
        }
        if (announcement.created_by !== user.id && user.role !== "admin") {
            throw new common_1.ForbiddenException("Non autorisé.");
        }
        await this.announcementRepository.remove(announcement);
        return { message: "Annonce supprimée avec succès." };
    }
    async getAnnouncement(id) {
        const announcement = await this.announcementRepository.findOne({
            where: { id },
            relations: ["creator"],
        });
        if (!announcement) {
            throw new common_1.NotFoundException("Annonce introuvable.");
        }
        return announcement;
    }
    async updateAnnouncement(id, data, user) {
        const announcement = await this.announcementRepository.findOne({
            where: { id },
        });
        if (!announcement) {
            throw new common_1.NotFoundException("Annonce introuvable.");
        }
        if (announcement.created_by !== user.id && user.role !== "admin") {
            throw new common_1.ForbiddenException("Non autorisé.");
        }
        const { title, message, target_audience, recipient_ids, scheduled_at } = data;
        let filteredIds = announcement.recipient_ids;
        if (target_audience === "specific_users" && recipient_ids) {
            const allowedUsers = await this.getScopedStagiaireUsers(user);
            const allowedIds = allowedUsers.map((u) => u.id);
            if (user.role !== "admin") {
                filteredIds = recipient_ids.filter((id) => allowedIds.includes(id));
            }
            else {
                filteredIds = recipient_ids;
            }
        }
        Object.assign(announcement, {
            title: title ?? announcement.title,
            message: message ?? announcement.message,
            target_audience: target_audience ?? announcement.target_audience,
            recipient_ids: filteredIds,
            scheduled_at: scheduled_at
                ? new Date(scheduled_at)
                : announcement.scheduled_at,
        });
        return await this.announcementRepository.save(announcement);
    }
    async getPotentialRecipients(user) {
        if (user.role === "admin") {
            return this.userRepository.find({
                select: ["id", "name", "email", "role"],
            });
        }
        const allowedUsers = await this.getScopedStagiaireUsers(user);
        return allowedUsers.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
        }));
    }
    async getScopedStagiaireUsers(sender) {
        if (sender.role === "admin") {
            return this.userRepository.find({ where: { role: "stagiaire" } });
        }
        if (sender.role === "formateur" || sender.role === "formatrice") {
            const formateur = await this.formateurRepository.findOne({
                where: { user_id: sender.id },
            });
            if (!formateur)
                return [];
            return this.userRepository
                .createQueryBuilder("user")
                .innerJoin("stagiaires", "stagiaire", "stagiaire.user_id = user.id")
                .innerJoin("formateur_stagiaire", "fs", "fs.stagiaire_id = stagiaire.id")
                .where("fs.formateur_id = :formateurId", { formateurId: formateur.id })
                .getMany();
        }
        if (sender.role === "commercial") {
            const commercial = await this.commercialRepository.findOne({
                where: { user_id: sender.id },
            });
            if (!commercial)
                return [];
            return this.userRepository
                .createQueryBuilder("user")
                .innerJoin("stagiaires", "stagiaire", "stagiaire.user_id = user.id")
                .innerJoin("commercial_stagiaire", "cs", "cs.stagiaire_id = stagiaire.id")
                .where("cs.commercial_id = :commercialId", {
                commercialId: commercial.id,
            })
                .getMany();
        }
        return [];
    }
    async getRecipientsForImmediateSend(targetAudience, filteredIds, user) {
        let recipients = [];
        if (targetAudience === "all" && user.role === "admin") {
            recipients = await this.userRepository.find();
        }
        else if (targetAudience === "formateurs" && user.role === "admin") {
            recipients = await this.userRepository.find({
                where: { role: (0, typeorm_2.In)(["formateur", "formatrice"]) },
            });
        }
        else if (targetAudience === "autres" && user.role === "admin") {
            recipients = await this.userRepository.find({
                where: { role: (0, typeorm_2.In)(["commercial", "admin"]) },
            });
        }
        else if (targetAudience === "stagiaires") {
            recipients = await this.getScopedStagiaireUsers(user);
        }
        else if (targetAudience === "specific_users") {
            if (filteredIds && filteredIds.length > 0) {
                recipients = await this.userRepository.findBy({ id: (0, typeorm_2.In)(filteredIds) });
            }
        }
        return recipients;
    }
};
exports.AnnouncementService = AnnouncementService;
exports.AnnouncementService = AnnouncementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(announcement_entity_1.Announcement)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(3, (0, typeorm_1.InjectRepository)(formateur_entity_1.Formateur)),
    __param(4, (0, typeorm_1.InjectRepository)(commercial_entity_1.Commercial)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], AnnouncementService);
//# sourceMappingURL=announcement.service.js.map