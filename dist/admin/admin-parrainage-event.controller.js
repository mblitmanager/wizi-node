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
exports.AdminParrainageEventController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const parrainage_event_entity_1 = require("../entities/parrainage-event.entity");
const api_response_service_1 = require("../common/services/api-response.service");
let AdminParrainageEventController = class AdminParrainageEventController {
    constructor(eventRepository, apiResponse) {
        this.eventRepository = eventRepository;
        this.apiResponse = apiResponse;
    }
    async index(page = 1, limit = 10, search = "") {
        const query = this.eventRepository.createQueryBuilder("e");
        if (search) {
            query.where("e.titre LIKE :search", { search: `%${search}%` });
        }
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy("e.id", "DESC")
            .getManyAndCount();
        return this.apiResponse.paginated(data, total, page, limit);
    }
    async create() {
        return this.apiResponse.success({ message: "Prepare for new event" });
    }
    async store(data) {
        const event = this.eventRepository.create(data);
        const saved = await this.eventRepository.save(event);
        return this.apiResponse.success(saved);
    }
    async show(id) {
        const event = await this.eventRepository.findOne({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException("Event not found");
        return this.apiResponse.success(event);
    }
    async update(id, data) {
        const event = await this.eventRepository.findOne({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException("Event not found");
        await this.eventRepository.update(id, data);
        const updated = await this.eventRepository.findOne({ where: { id } });
        return this.apiResponse.success(updated);
    }
    async destroy(id) {
        const event = await this.eventRepository.findOne({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException("Event not found");
        await this.eventRepository.delete(id);
        return this.apiResponse.success();
    }
    async edit(id) {
        const event = await this.eventRepository.findOne({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException("Event not found");
        return this.apiResponse.success(event);
    }
};
exports.AdminParrainageEventController = AdminParrainageEventController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminParrainageEventController.prototype, "index", null);
__decorate([
    (0, common_1.Get)("create"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminParrainageEventController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminParrainageEventController.prototype, "store", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminParrainageEventController.prototype, "show", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminParrainageEventController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminParrainageEventController.prototype, "destroy", null);
__decorate([
    (0, common_1.Get)(":id/edit"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminParrainageEventController.prototype, "edit", null);
exports.AdminParrainageEventController = AdminParrainageEventController = __decorate([
    (0, common_1.Controller)("admin/parrainage_events"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(parrainage_event_entity_1.ParrainageEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], AdminParrainageEventController);
//# sourceMappingURL=admin-parrainage-event.controller.js.map