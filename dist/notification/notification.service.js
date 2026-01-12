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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../entities/notification.entity");
const user_entity_1 = require("../entities/user.entity");
const fcm_service_1 = require("./fcm.service");
const parrainage_event_entity_1 = require("../entities/parrainage-event.entity");
let NotificationService = class NotificationService {
    constructor(notificationRepository, userRepository, parrainageEventRepository, fcmService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.parrainageEventRepository = parrainageEventRepository;
        this.fcmService = fcmService;
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
            if (user && user.fcm_token) {
                await this.fcmService.sendPushNotification(user.fcm_token, title || "Nouvelle notification", message, data);
            }
        }
        catch (error) {
            console.error("Failed to send push notification:", error);
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
            created_at: event.created_at?.toISOString(),
            updated_at: event.updated_at?.toISOString(),
            status: event.status,
        }));
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(parrainage_event_entity_1.ParrainageEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        fcm_service_1.FcmService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map