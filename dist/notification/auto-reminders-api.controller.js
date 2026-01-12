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
exports.AutoRemindersApiController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const api_response_service_1 = require("../common/services/api-response.service");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../entities/notification.entity");
let AutoRemindersApiController = class AutoRemindersApiController {
    constructor(apiResponse, notificationRepository) {
        this.apiResponse = apiResponse;
        this.notificationRepository = notificationRepository;
    }
    async history(req, page = 1) {
        const pageNum = typeof page === "string" ? parseInt(page, 10) : page || 1;
        const limit = 20;
        const skip = (pageNum - 1) * limit;
        const query = this.notificationRepository
            .createQueryBuilder("n")
            .leftJoinAndSelect("n.user", "user")
            .orderBy("n.created_at", "DESC");
        if (!["admin", "administrateur", "commercial"].includes(req.user.role)) {
            query.where("n.user_id = :userId", { userId: req.user.id });
        }
        const [items, total] = await query.skip(skip).take(limit).getManyAndCount();
        const lastPage = Math.ceil(total / limit);
        const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;
        const data = items.map((n) => ({
            id: n.id,
            message: n.message,
            data: n.data || {},
            type: n.type,
            title: n.title,
            read: n.read,
            user_id: n.user_id,
            created_at: n.created_at?.toISOString(),
            updated_at: n.updated_at?.toISOString(),
            user: n.user
                ? {
                    id: n.user.id,
                    name: n.user.name,
                    email: n.user.email,
                }
                : null,
        }));
        return {
            current_page: pageNum,
            data: data,
            first_page_url: `${baseUrl}?page=1`,
            from: skip + 1,
            last_page: lastPage,
            last_page_url: `${baseUrl}?page=${lastPage}`,
            links: this.generatePaginationLinks(baseUrl, pageNum, lastPage),
            next_page_url: pageNum < lastPage ? `${baseUrl}?page=${pageNum + 1}` : null,
            path: baseUrl,
            per_page: limit,
            prev_page_url: pageNum > 1 ? `${baseUrl}?page=${pageNum - 1}` : null,
            to: skip + data.length,
            total: total,
        };
    }
    generatePaginationLinks(baseUrl, current, last) {
        const links = [];
        links.push({
            url: current > 1 ? `${baseUrl}?page=${current - 1}` : null,
            label: "pagination.previous",
            active: false,
        });
        for (let i = 1; i <= last; i++) {
            links.push({
                url: `${baseUrl}?page=${i}`,
                label: i.toString(),
                active: i === current,
            });
        }
        links.push({
            url: current < last ? `${baseUrl}?page=${current + 1}` : null,
            label: "pagination.next",
            active: false,
        });
        return links;
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
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("page")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
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
    (0, roles_decorator_1.Roles)("administrateur", "admin", "formateur", "formatrice", "commercial", "stagiaire"),
    __param(1, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService,
        typeorm_2.Repository])
], AutoRemindersApiController);
//# sourceMappingURL=auto-reminders-api.controller.js.map