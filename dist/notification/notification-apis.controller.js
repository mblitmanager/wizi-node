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
exports.ParrainageEventsApiController = exports.SendDailyNotificationController = exports.NotifyApiController = exports.EmailApiController = exports.ContactApiController = exports.OnlineUsersApiController = exports.AutoRemindersApiController = exports.AnnouncementsApiController = exports.ParrainageApiController = exports.NotificationHistoryApiController = exports.NotificationsApiController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const mail_service_1 = require("../mail/mail.service");
let NotificationsApiController = class NotificationsApiController {
    constructor() { }
    async index(req) {
        return { data: [], message: "Notifications" };
    }
    async unreadCount() {
        return { count: 0 };
    }
    async markAllRead() {
        return { message: "All marked as read" };
    }
    async markAsRead(id) {
        return { message: "Marked as read" };
    }
    async delete(id) {
        return { message: "Notification deleted" };
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsApiController.prototype, "unreadCount", null);
__decorate([
    (0, common_1.Post)("mark-all-read"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsApiController.prototype, "markAllRead", null);
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
    (0, common_1.Controller)("api/notifications"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [])
], NotificationsApiController);
let NotificationHistoryApiController = class NotificationHistoryApiController {
    constructor() { }
    async index() {
        return { data: [], message: "Notification history" };
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
    (0, common_1.Controller)("api/notification-history"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [])
], NotificationHistoryApiController);
let ParrainageApiController = class ParrainageApiController {
    constructor() { }
    async generateLink() {
        return { link: "http://example.com/parrainage/token" };
    }
    async getData(token) {
        return { data: {}, message: "Parrainage data" };
    }
    async registerFilleul(data) {
        return { message: "Filleul registered" };
    }
    async stats() {
        return { data: {}, message: "Parrainage stats" };
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
    (0, common_1.Controller)("api/parrainage"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [])
], ParrainageApiController);
let AnnouncementsApiController = class AnnouncementsApiController {
    constructor() { }
    async index() {
        return { data: [], message: "Announcements" };
    }
    async store(data) {
        return { message: "Announcement created", data };
    }
    async getRecipients() {
        return { data: [], message: "Recipients list" };
    }
    async show(id) {
        return { data: {}, message: "Announcement details" };
    }
    async update(id, data) {
        return { message: "Announcement updated", data };
    }
    async destroy(id) {
        return { message: "Announcement deleted" };
    }
};
exports.AnnouncementsApiController = AnnouncementsApiController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnnouncementsApiController.prototype, "index", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsApiController.prototype, "store", null);
__decorate([
    (0, common_1.Get)("recipients"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnnouncementsApiController.prototype, "getRecipients", null);
__decorate([
    (0, common_1.Get)(":announcement"),
    __param(0, (0, common_1.Param)("announcement")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AnnouncementsApiController.prototype, "show", null);
__decorate([
    (0, common_1.Put)(":announcement"),
    __param(0, (0, common_1.Param)("announcement")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsApiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":announcement"),
    __param(0, (0, common_1.Param)("announcement")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AnnouncementsApiController.prototype, "destroy", null);
exports.AnnouncementsApiController = AnnouncementsApiController = __decorate([
    (0, common_1.Controller)("api/announcements"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [])
], AnnouncementsApiController);
let AutoRemindersApiController = class AutoRemindersApiController {
    constructor() { }
    async history() {
        return { data: [], message: "Reminder history" };
    }
    async stats() {
        return { data: {}, message: "Reminder stats" };
    }
    async targeted() {
        return { data: [], message: "Targeted users" };
    }
    async run() {
        return { message: "Reminders sent" };
    }
};
exports.AutoRemindersApiController = AutoRemindersApiController;
__decorate([
    (0, common_1.Get)("history"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutoRemindersApiController.prototype, "history", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutoRemindersApiController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)("targeted"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutoRemindersApiController.prototype, "targeted", null);
__decorate([
    (0, common_1.Post)("run"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutoRemindersApiController.prototype, "run", null);
exports.AutoRemindersApiController = AutoRemindersApiController = __decorate([
    (0, common_1.Controller)("api/auto-reminders"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [])
], AutoRemindersApiController);
let OnlineUsersApiController = class OnlineUsersApiController {
    constructor() { }
    async index() {
        return { data: [], message: "Online users" };
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
    (0, common_1.Controller)("api/online-users"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [])
], OnlineUsersApiController);
let ContactApiController = class ContactApiController {
    constructor() { }
    async sendContactForm(data) {
        return { message: "Contact form sent" };
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
    (0, common_1.Controller)("api/contact"),
    __metadata("design:paramtypes", [])
], ContactApiController);
let EmailApiController = class EmailApiController {
    constructor(mailService) {
        this.mailService = mailService;
    }
    async send(data) {
        return { message: "Email sent" };
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
    (0, common_1.Controller)("api/email"),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], EmailApiController);
let NotifyApiController = class NotifyApiController {
    constructor() { }
    async send(data) {
        return { message: "Notification sent" };
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
    (0, common_1.Controller)("api/notify"),
    __metadata("design:paramtypes", [])
], NotifyApiController);
let SendDailyNotificationController = class SendDailyNotificationController {
    constructor() { }
    async send() {
        return { message: "Daily notifications sent" };
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
    (0, common_1.Controller)("api/send-daily-notification"),
    __metadata("design:paramtypes", [])
], SendDailyNotificationController);
let ParrainageEventsApiController = class ParrainageEventsApiController {
    constructor() { }
    async index() {
        return { data: [], message: "Parrainage events" };
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
    (0, common_1.Controller)("api/parrainage-events"),
    __metadata("design:paramtypes", [])
], ParrainageEventsApiController);
//# sourceMappingURL=notification-apis.controller.js.map