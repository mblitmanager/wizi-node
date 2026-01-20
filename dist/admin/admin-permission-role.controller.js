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
exports.AdminRoleController = exports.AdminPermissionController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const api_response_service_1 = require("../common/services/api-response.service");
let AdminPermissionController = class AdminPermissionController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async index(page = 1, limit = 10, search = "") {
        return this.apiResponse.paginated([], 0, page, limit);
    }
    async store(data) {
        return this.apiResponse.success(data);
    }
    async show(id) {
        return this.apiResponse.success({ id });
    }
    async update(id, data) {
        return this.apiResponse.success(data);
    }
    async destroy(id) {
        return this.apiResponse.success();
    }
    async toggleStatus(id) {
        return this.apiResponse.success({ id });
    }
};
exports.AdminPermissionController = AdminPermissionController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPermissionController.prototype, "index", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminPermissionController.prototype, "store", null);
__decorate([
    (0, common_1.Get)(":permission"),
    __param(0, (0, common_1.Param)("permission")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminPermissionController.prototype, "show", null);
__decorate([
    (0, common_1.Put)(":permission"),
    __param(0, (0, common_1.Param)("permission")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminPermissionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":permission"),
    __param(0, (0, common_1.Param)("permission")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminPermissionController.prototype, "destroy", null);
__decorate([
    (0, common_1.Post)(":permission/toggle-status"),
    __param(0, (0, common_1.Param)("permission")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminPermissionController.prototype, "toggleStatus", null);
exports.AdminPermissionController = AdminPermissionController = __decorate([
    (0, common_1.Controller)("admin/permissions"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], AdminPermissionController);
let AdminRoleController = class AdminRoleController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async index(page = 1, limit = 10, search = "") {
        return this.apiResponse.paginated([], 0, page, limit);
    }
    async store(data) {
        return this.apiResponse.success(data);
    }
    async show(id) {
        return this.apiResponse.success({ id });
    }
    async update(id, data) {
        return this.apiResponse.success(data);
    }
    async destroy(id) {
        return this.apiResponse.success();
    }
    async toggleStatus(id) {
        return this.apiResponse.success({ id });
    }
};
exports.AdminRoleController = AdminRoleController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminRoleController.prototype, "index", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminRoleController.prototype, "store", null);
__decorate([
    (0, common_1.Get)(":role"),
    __param(0, (0, common_1.Param)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminRoleController.prototype, "show", null);
__decorate([
    (0, common_1.Put)(":role"),
    __param(0, (0, common_1.Param)("role")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminRoleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":role"),
    __param(0, (0, common_1.Param)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminRoleController.prototype, "destroy", null);
__decorate([
    (0, common_1.Post)(":role/toggle-status"),
    __param(0, (0, common_1.Param)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminRoleController.prototype, "toggleStatus", null);
exports.AdminRoleController = AdminRoleController = __decorate([
    (0, common_1.Controller)("admin/roles"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], AdminRoleController);
//# sourceMappingURL=admin-permission-role.controller.js.map