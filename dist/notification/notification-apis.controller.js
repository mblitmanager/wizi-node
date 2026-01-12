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
exports.ParrainageEventsApiController = exports.SendDailyNotificationController = exports.NotifyApiController = exports.EmailApiController = exports.ContactApiController = exports.OnlineUsersApiController = exports.ParrainageApiController = exports.NotificationHistoryApiController = exports.NotificationsApiController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const mail_service_1 = require("../mail/mail.service");
const notification_service_1 = require("./notification.service");
const api_response_service_1 = require("../common/services/api-response.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entities/user.entity");
const typeorm_2 = require("typeorm");
let NotificationsApiController = class NotificationsApiController {
    constructor(notificationService, apiResponse, userRepository) {
        this.notificationService = notificationService;
        this.apiResponse = apiResponse;
        this.userRepository = userRepository;
    }
    async index(req) {
        const notifications = await this.notificationService.getNotifications(req.user.id);
        return this.apiResponse.success(notifications);
    }
    async unreadCount(req) {
        const count = await this.notificationService.getUnreadCount(req.user.id);
        return this.apiResponse.success({ count });
    }
    async markAllRead(req) {
        await this.notificationService.markAllAsRead(req.user.id);
        return this.apiResponse.success({ message: "All marked as read" });
    }
    async updateFcmToken(req, token) {
        await this.userRepository.update(req.user.id, { fcm_token: token });
        return this.apiResponse.success({ message: "FCM token updated" });
    }
    async markAsRead(id) {
        await this.notificationService.markAsRead(id);
        return this.apiResponse.success({ message: "Marked as read" });
    }
    async delete(id) {
        return this.apiResponse.success({ message: "Notification deleted" });
    }
};
exports.NotificationsApiController = NotificationsApiController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsApiController.prototype, "index", null);
__decorate([
    (0, common_1.Get)("unread-count"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsApiController.prototype, "unreadCount", null);
__decorate([
    (0, common_1.Post)("mark-all-read"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsApiController.prototype, "markAllRead", null);
__decorate([
    (0, common_1.Post)("fcm-token"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsApiController.prototype, "updateFcmToken", null);
__decorate([
    (0, common_1.Post)(":id/read"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationsApiController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationsApiController.prototype, "delete", null);
exports.NotificationsApiController = NotificationsApiController = __decorate([
    (0, common_1.Controller)("notifications"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        api_response_service_1.ApiResponseService,
        typeorm_2.Repository])
], NotificationsApiController);
let NotificationHistoryApiController = class NotificationHistoryApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async index() {
        return this.apiResponse.success([]);
    }
};
exports.NotificationHistoryApiController = NotificationHistoryApiController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationHistoryApiController.prototype, "index", null);
exports.NotificationHistoryApiController = NotificationHistoryApiController = __decorate([
    (0, common_1.Controller)("notification-history"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], NotificationHistoryApiController);
let ParrainageApiController = class ParrainageApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async generateLink() {
        return this.apiResponse.success({
            link: "http://example.com/parrainage/token",
        });
    }
    async getData(token) {
        return this.apiResponse.success({});
    }
    async registerFilleul(data) {
        return this.apiResponse.success({ message: "Filleul registered" });
    }
    async stats() {
        return this.apiResponse.success({});
    }
};
exports.ParrainageApiController = ParrainageApiController;
__decorate([
    (0, common_1.Post)("generate-link"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParrainageApiController.prototype, "generateLink", null);
__decorate([
    (0, common_1.Get)("get-data/:token"),
    __param(0, (0, common_1.Param)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParrainageApiController.prototype, "getData", null);
__decorate([
    (0, common_1.Post)("register-filleul"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParrainageApiController.prototype, "registerFilleul", null);
__decorate([
    (0, common_1.Get)("stats/:parrain_id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParrainageApiController.prototype, "stats", null);
exports.ParrainageApiController = ParrainageApiController = __decorate([
    (0, common_1.Controller)("parrainage"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], ParrainageApiController);
let OnlineUsersApiController = class OnlineUsersApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async index() {
        return this.apiResponse.success([]);
    }
};
exports.OnlineUsersApiController = OnlineUsersApiController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OnlineUsersApiController.prototype, "index", null);
exports.OnlineUsersApiController = OnlineUsersApiController = __decorate([
    (0, common_1.Controller)("online-users"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], OnlineUsersApiController);
let ContactApiController = class ContactApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async sendContactForm(data) {
        return this.apiResponse.success({ message: "Contact form sent" });
    }
};
exports.ContactApiController = ContactApiController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContactApiController.prototype, "sendContactForm", null);
exports.ContactApiController = ContactApiController = __decorate([
    (0, common_1.Controller)("contact"),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], ContactApiController);
let EmailApiController = class EmailApiController {
    constructor(mailService, apiResponse) {
        this.mailService = mailService;
        this.apiResponse = apiResponse;
    }
    async send(data) {
        return this.apiResponse.success({ message: "Email sent" });
    }
};
exports.EmailApiController = EmailApiController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailApiController.prototype, "send", null);
exports.EmailApiController = EmailApiController = __decorate([
    (0, common_1.Controller)("email"),
    __metadata("design:paramtypes", [mail_service_1.MailService,
        api_response_service_1.ApiResponseService])
], EmailApiController);
let NotifyApiController = class NotifyApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async send(data) {
        return this.apiResponse.success({ message: "Notification sent" });
    }
};
exports.NotifyApiController = NotifyApiController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotifyApiController.prototype, "send", null);
exports.NotifyApiController = NotifyApiController = __decorate([
    (0, common_1.Controller)("notify"),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], NotifyApiController);
let SendDailyNotificationController = class SendDailyNotificationController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async send() {
        return this.apiResponse.success({ message: "Daily notifications sent" });
    }
};
exports.SendDailyNotificationController = SendDailyNotificationController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SendDailyNotificationController.prototype, "send", null);
exports.SendDailyNotificationController = SendDailyNotificationController = __decorate([
    (0, common_1.Controller)("send-daily-notification"),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], SendDailyNotificationController);
let ParrainageEventsApiController = class ParrainageEventsApiController {
    constructor(notificationService, apiResponse) {
        this.notificationService = notificationService;
        this.apiResponse = apiResponse;
    }
    async index() {
        const events = await this.notificationService.getParrainageEvents();
        return this.apiResponse.success(events);
    }
};
exports.ParrainageEventsApiController = ParrainageEventsApiController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParrainageEventsApiController.prototype, "index", null);
exports.ParrainageEventsApiController = ParrainageEventsApiController = __decorate([
    (0, common_1.Controller)("parrainage-events"),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        api_response_service_1.ApiResponseService])
], ParrainageEventsApiController);
//# sourceMappingURL=notification-apis.controller.js.map