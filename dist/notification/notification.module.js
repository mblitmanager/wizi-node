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
const user_entity_1 = require("../entities/user.entity");
const common_module_1 = require("../common/common.module");
const notification_service_1 = require("./notification.service");
const notification_entity_1 = require("../entities/notification.entity");
const fcm_service_1 = require("./fcm.service");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
const parrainage_event_entity_1 = require("../entities/parrainage-event.entity");
const notification_apis_controller_1 = require("./notification-apis.controller");
const auto_reminders_api_controller_1 = require("./auto-reminders-api.controller");
const broadcasting_api_controller_1 = require("./broadcasting-api.controller");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            common_module_1.CommonModule,
            bullmq_1.BullModule.registerQueue({
                name: "notifications",
            }),
            typeorm_1.TypeOrmModule.forFeature([notification_entity_1.Notification, user_entity_1.User, parrainage_event_entity_1.ParrainageEvent]),
        ],
        providers: [notification_service_1.NotificationService, fcm_service_1.FcmService],
        controllers: [
            notification_apis_controller_1.NotificationsApiController,
            notification_apis_controller_1.NotificationHistoryApiController,
            auto_reminders_api_controller_1.AutoRemindersApiController,
            notification_apis_controller_1.OnlineUsersApiController,
            notification_apis_controller_1.ContactApiController,
            notification_apis_controller_1.EmailApiController,
            notification_apis_controller_1.NotifyApiController,
            notification_apis_controller_1.SendDailyNotificationController,
            notification_apis_controller_1.ParrainageEventsApiController,
            broadcasting_api_controller_1.BroadcastingApiController,
        ],
        exports: [notification_service_1.NotificationService, fcm_service_1.FcmService],
    })
], NotificationModule);
//# sourceMappingURL=notification.module.js.map