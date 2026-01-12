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
exports.AdminSettingsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const setting_entity_1 = require("../entities/setting.entity");
const api_response_service_1 = require("../common/services/api-response.service");
let AdminSettingsController = class AdminSettingsController {
    constructor(settingRepository, apiResponse) {
        this.settingRepository = settingRepository;
        this.apiResponse = apiResponse;
    }
    async getSettings() {
        const settings = await this.settingRepository.find();
        const settingsObject = {};
        settings.forEach((setting) => {
            settingsObject[setting.key] = isNaN(Number(setting.value))
                ? setting.value === "true"
                    ? true
                    : setting.value === "false"
                        ? false
                        : setting.value
                : Number(setting.value);
        });
        return this.apiResponse.success(settingsObject);
    }
    async updateSettings(body) {
        for (const [key, value] of Object.entries(body)) {
            let setting = await this.settingRepository.findOne({
                where: { key },
            });
            if (setting) {
                setting.value = String(value);
                await this.settingRepository.save(setting);
            }
            else {
                const newSetting = this.settingRepository.create({
                    key,
                    value: String(value),
                });
                await this.settingRepository.save(newSetting);
            }
        }
        return this.apiResponse.success(body);
    }
};
exports.AdminSettingsController = AdminSettingsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "updateSettings", null);
exports.AdminSettingsController = AdminSettingsController = __decorate([
    (0, common_1.Controller)("administrateur/parametre"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(setting_entity_1.Setting)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        api_response_service_1.ApiResponseService])
], AdminSettingsController);
//# sourceMappingURL=admin-settings.controller.js.map