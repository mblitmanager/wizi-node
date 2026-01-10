"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const common_module_1 = require("../common/common.module");
const api_response_service_1 = require("../common/services/api-response.service");
const notification_service_1 = require("./notification.service");
const notification_controller_1 = require("./notification.controller");
const notification_entity_1 = require("../entities/notification.entity");
const fcm_service_1 = require("./fcm.service");
const config_1 = require("@nestjs/config");
const notification_apis_controller_1 = require("./notification-apis.controller");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            common_module_1.CommonModule,
            typeorm_1.TypeOrmModule.forFeature([notification_entity_1.Notification]),
        ],
        providers: [notification_service_1.NotificationService, api_response_service_1.ApiResponseService, fcm_service_1.FcmService],
        controllers: [
            notification_controller_1.NotificationController,
            notification_apis_controller_1.NotificationsApiController,
            notification_apis_controller_1.NotificationHistoryApiController,
            notification_apis_controller_1.ParrainageApiController,
            notification_apis_controller_1.AnnouncementsApiController,
            notification_apis_controller_1.AutoRemindersApiController,
            notification_apis_controller_1.OnlineUsersApiController,
            notification_apis_controller_1.ContactApiController,
            notification_apis_controller_1.EmailApiController,
            notification_apis_controller_1.NotifyApiController,
            notification_apis_controller_1.SendDailyNotificationController,
            notification_apis_controller_1.ParrainageEventsApiController,
        ],
        exports: [notification_service_1.NotificationService, fcm_service_1.FcmService],
    })
], NotificationModule);
//# sourceMappingURL=notification.module.js.map