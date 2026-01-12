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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoRemindersApiController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const api_response_service_1 = require("../common/services/api-response.service");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let AutoRemindersApiController = class AutoRemindersApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async history() {
        return this.apiResponse.success([
            {
                id: 1,
                type: "daily_reminder",
                sent_at: new Date().toISOString(),
                recipients_count: 5,
                status: "success",
            },
        ]);
    }
    async stats() {
        return this.apiResponse.success({
            total_sent: 125,
            engagement_rate: "45%",
            last_run: new Date().toISOString(),
        });
    }
    async targeted() {
        return this.apiResponse.success([
            { id: 1, name: "Stagiaire Test", email: "test@example.com" },
        ]);
    }
    async run() {
        return this.apiResponse.success({
            message: "Les rappels automatiques ont été lancés.",
        });
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
    (0, common_1.Controller)("auto-reminders"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], AutoRemindersApiController);
//# sourceMappingURL=auto-reminders-api.controller.js.map