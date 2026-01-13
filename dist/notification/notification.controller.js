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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const notification_service_1 = require("./notification.service");
const api_response_service_1 = require("../common/services/api-response.service");
let NotificationController = class NotificationController {
    constructor(notificationService, apiResponse) {
        this.notificationService = notificationService;
        this.apiResponse = apiResponse;
    }
    async getNotifications(req) {
        const notifications = await this.notificationService.getNotifications(req.user.id);
        return this.apiResponse.success(notifications);
    }
    async getUnreadCount(req) {
        const count = await this.notificationService.getUnreadCount(req.user.id);
        return this.apiResponse.success({ count });
    }
    async markAsRead(id) {
        await this.notificationService.markAsRead(id);
        return this.apiResponse.success({ message: "Marked as read" });
    }
    async markAllAsRead(req) {
        await this.notificationService.markAllAsRead(req.user.id);
        return this.apiResponse.success({ message: "All marked as read" });
    }
    async deleteNotification(id) {
        await this.notificationService.deleteNotification(id);
        return this.apiResponse.success({ message: "Notification deleted" });
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)("unread-count"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Post)(":id/read"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)("mark-all-read"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteNotification", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)("notifications"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        api_response_service_1.ApiResponseService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map