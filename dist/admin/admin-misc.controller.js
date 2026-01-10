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
exports.AdminMediasController = exports.AdminPartenaireController = exports.AdminParrainageController = exports.AdminClassementController = exports.AdminParametreController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let AdminParametreController = class AdminParametreController {
    constructor() { }
    async index(page = 1, limit = 10, search = "") {
        return {
            data: [],
            pagination: { total: 0, page, total_pages: 0 },
        };
    }
    async create() {
        return { message: "Create parametre form" };
    }
    async store(data) {
        return { message: "Parametre created", data };
    }
    async show(id) {
        return { id, message: "Parametre details" };
    }
    async edit(id) {
        return { id, message: "Edit parametre form" };
    }
    async update(id, data) {
        return { id, message: "Parametre updated", data };
    }
    async destroy(id) {
        return { id, message: "Parametre deleted" };
    }
    async resetDataForm() {
        return { message: "Reset data confirmation form" };
    }
    async resetData() {
        return { message: "Data reset completed" };
    }
    async updateImage(id, data) {
        return { id, message: "Image updated", data };
    }
};
exports.AdminParametreController = AdminParametreController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminParametreController.prototype, "index", null);
__decorate([
    (0, common_1.Get)("create"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminParametreController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminParametreController.prototype, "store", null);
__decorate([
    (0, common_1.Get)(":parametre"),
    __param(0, (0, common_1.Param)("parametre")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminParametreController.prototype, "show", null);
__decorate([
    (0, common_1.Get)(":parametre/edit"),
    __param(0, (0, common_1.Param)("parametre")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminParametreController.prototype, "edit", null);
__decorate([
    (0, common_1.Put)(":parametre"),
    __param(0, (0, common_1.Param)("parametre")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminParametreController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":parametre"),
    __param(0, (0, common_1.Param)("parametre")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminParametreController.prototype, "destroy", null);
__decorate([
    (0, common_1.Get)("reset-data"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminParametreController.prototype, "resetDataForm", null);
__decorate([
    (0, common_1.Post)("reset-data"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminParametreController.prototype, "resetData", null);
__decorate([
    (0, common_1.Put)(":id/update-image"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminParametreController.prototype, "updateImage", null);
exports.AdminParametreController = AdminParametreController = __decorate([
    (0, common_1.Controller)("administrateur/parametre"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __metadata("design:paramtypes", [])
], AdminParametreController);
let AdminClassementController = class AdminClassementController {
    constructor() { }
    async index() {
        return { data: [], message: "Classements list" };
    }
};
exports.AdminClassementController = AdminClassementController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminClassementController.prototype, "index", null);
exports.AdminClassementController = AdminClassementController = __decorate([
    (0, common_1.Controller)("administrateur/classements"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __metadata("design:paramtypes", [])
], AdminClassementController);
let AdminParrainageController = class AdminParrainageController {
    constructor() { }
    async index() {
        return { data: [], message: "Parrainage list" };
    }
    async show(id) {
        return { id, message: "Parrainage details" };
    }
};
exports.AdminParrainageController = AdminParrainageController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminParrainageController.prototype, "index", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminParrainageController.prototype, "show", null);
exports.AdminParrainageController = AdminParrainageController = __decorate([
    (0, common_1.Controller)("administrateur/parrainage"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __metadata("design:paramtypes", [])
], AdminParrainageController);
let AdminPartenaireController = class AdminPartenaireController {
    constructor() { }
    async index(page = 1, limit = 10, search = "") {
        return {
            data: [],
            pagination: { total: 0, page, total_pages: 0 },
        };
    }
    async create() {
        return { message: "Create partenaire form" };
    }
    async store(data) {
        return { message: "Partenaire created", data };
    }
    async import(data) {
        return { message: "Partenaires imported", data };
    }
    async show(id) {
        return { id, message: "Partenaire details" };
    }
    async edit(id) {
        return { id, message: "Edit partenaire form" };
    }
    async update(id, data) {
        return { id, message: "Partenaire updated", data };
    }
    async destroy(id) {
        return { id, message: "Partenaire deleted" };
    }
    async classements(id) {
        return { id, message: "Partenaire classements" };
    }
};
exports.AdminPartenaireController = AdminPartenaireController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPartenaireController.prototype, "index", null);
__decorate([
    (0, common_1.Get)("create"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminPartenaireController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminPartenaireController.prototype, "store", null);
__decorate([
    (0, common_1.Post)("import"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminPartenaireController.prototype, "import", null);
__decorate([
    (0, common_1.Get)(":partenaire"),
    __param(0, (0, common_1.Param)("partenaire")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminPartenaireController.prototype, "show", null);
__decorate([
    (0, common_1.Get)(":partenaire/edit"),
    __param(0, (0, common_1.Param)("partenaire")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminPartenaireController.prototype, "edit", null);
__decorate([
    (0, common_1.Put)(":partenaire"),
    __param(0, (0, common_1.Param)("partenaire")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminPartenaireController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":partenaire"),
    __param(0, (0, common_1.Param)("partenaire")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminPartenaireController.prototype, "destroy", null);
__decorate([
    (0, common_1.Get)(":partenaire/classements"),
    __param(0, (0, common_1.Param)("partenaire")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminPartenaireController.prototype, "classements", null);
exports.AdminPartenaireController = AdminPartenaireController = __decorate([
    (0, common_1.Controller)("administrateur/partenaires"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __metadata("design:paramtypes", [])
], AdminPartenaireController);
let AdminMediasController = class AdminMediasController {
    constructor() { }
    async index(page = 1, limit = 10, search = "") {
        return {
            data: [],
            pagination: { total: 0, page, total_pages: 0 },
        };
    }
    async create() {
        return { message: "Create media form" };
    }
    async store(data) {
        return { message: "Media created", data };
    }
    async show(id) {
        return { id, message: "Media details" };
    }
    async edit(id) {
        return { id, message: "Edit media form" };
    }
    async update(id, data) {
        return { id, message: "Media updated", data };
    }
    async destroy(id) {
        return { id, message: "Media deleted" };
    }
};
exports.AdminMediasController = AdminMediasController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminMediasController.prototype, "index", null);
__decorate([
    (0, common_1.Get)("create"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminMediasController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminMediasController.prototype, "store", null);
__decorate([
    (0, common_1.Get)(":media"),
    __param(0, (0, common_1.Param)("media")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminMediasController.prototype, "show", null);
__decorate([
    (0, common_1.Get)(":media/edit"),
    __param(0, (0, common_1.Param)("media")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminMediasController.prototype, "edit", null);
__decorate([
    (0, common_1.Put)(":media"),
    __param(0, (0, common_1.Param)("media")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminMediasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":media"),
    __param(0, (0, common_1.Param)("media")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminMediasController.prototype, "destroy", null);
exports.AdminMediasController = AdminMediasController = __decorate([
    (0, common_1.Controller)("administrateur/medias"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __metadata("design:paramtypes", [])
], AdminMediasController);
//# sourceMappingURL=admin-misc.controller.js.map