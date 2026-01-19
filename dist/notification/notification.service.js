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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../entities/notification.entity");
const user_entity_1 = require("../entities/user.entity");
const fcm_service_1 = require("./fcm.service");
const parrainage_event_entity_1 = require("../entities/parrainage-event.entity");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let NotificationService = class NotificationService {
    constructor(notificationRepository, userRepository, parrainageEventRepository, fcmService, notificationsQueue) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.parrainageEventRepository = parrainageEventRepository;
        this.fcmService = fcmService;
        this.notificationsQueue = notificationsQueue;
    }
    async createNotification(userId, type, message, data = {}, title) {
        const notification = this.notificationRepository.create({
            user_id: userId,
            type,
            title: title || null,
            message,
            data,
            read: false,
        });
        const savedNotification = await this.notificationRepository.save(notification);
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            await this.notificationsQueue.add("send-push", {
                userId,
                title: title || "Nouvelle notification",
                message,
                data,
                fcmToken: user?.fcm_token,
            });
        }
        catch (error) {
            console.error("Failed to queue notification job:", error);
        }
        return savedNotification;
    }
    async getNotifications(userId) {
        const notifications = await this.notificationRepository.find({
            where: { user_id: userId },
            order: { created_at: "DESC" },
        });
        const formattedNotifications = notifications.map((notification) => ({
            id: notification.id,
            message: notification.message,
            data: notification.data || [],
            type: notification.type,
            title: notification.title,
            read: notification.read,
            user_id: notification.user_id,
            created_at: notification.created_at?.toISOString(),
            updated_at: notification.updated_at?.toISOString(),
        }));
        return { data: formattedNotifications };
    }
    async markAsRead(notificationId) {
        return this.notificationRepository.update(notificationId, { read: true });
    }
    async getUnreadCount(userId) {
        return this.notificationRepository.count({
            where: { user_id: userId, read: false },
        });
    }
    async markAllAsRead(userId) {
        return this.notificationRepository.update({ user_id: userId }, { read: true });
    }
    async deleteNotification(notificationId) {
        return this.notificationRepository.delete(notificationId);
    }
    async getParrainageEvents() {
        const events = await this.parrainageEventRepository.find({
            order: { date_debut: "DESC" },
        });
        return events.map((event) => ({
            id: event.id,
            titre: event.titre,
            prix: event.prix ? event.prix.toString() : "0.00",
            date_debut: event.date_debut
                ? new Date(event.date_debut).toISOString().split("T")[0]
                : null,
            date_fin: event.date_fin
                ? new Date(event.date_fin).toISOString().split("T")[0]
                : null,
            created_at: this.formatIso(event.created_at),
            updated_at: this.formatIso(event.updated_at),
            status: event.status,
        }));
    }
    async getNotificationHistoryPaginated(userId, page = 1, perPage = 10, baseUrl = "") {
        const [data, total] = await this.notificationRepository
            .createQueryBuilder("n")
            .where("n.user_id = :userId", { userId })
            .orderBy("n.created_at", "DESC")
            .skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();
        const formattedData = data.map((n) => ({
            id: n.id,
            type: n.type,
            notifiable_type: "App\\Models\\User",
            notifiable_id: n.user_id,
            data: typeof n.data === "string" ? JSON.parse(n.data) : n.data || {},
            read_at: n.read ? this.formatDateTime(n.updated_at) : null,
            created_at: this.formatIso(n.created_at),
            updated_at: this.formatIso(n.updated_at),
        }));
        return this.formatPagination(formattedData, total, page, perPage, baseUrl);
    }
    formatPagination(data, total, page, perPage, baseUrl) {
        const lastPage = Math.max(1, Math.ceil(total / perPage));
        return {
            current_page: Number(page),
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
    formatIso(date) {
        if (!date)
            return null;
        const d = new Date(date);
        if (isNaN(d.getTime()))
            return null;
        return d.toISOString().replace(".000Z", ".000000Z");
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
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(parrainage_event_entity_1.ParrainageEvent)),
    __param(4, (0, bullmq_1.InjectQueue)("notifications")),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        fcm_service_1.FcmService, typeof (_a = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _a : Object])
], NotificationService);
//# sourceMappingURL=notification.service.js.map