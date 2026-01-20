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
var UserStatusTaskService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatusTaskService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
let UserStatusTaskService = UserStatusTaskService_1 = class UserStatusTaskService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(UserStatusTaskService_1.name);
    }
    async handleCron() {
        this.logger.debug("Checking for inactive users...");
        const timeoutThreshold = new Date(Date.now() - 15 * 60 * 1000);
        const result = await this.userRepository.update({
            is_online: true,
            last_activity_at: (0, typeorm_2.LessThan)(timeoutThreshold),
        }, {
            is_online: false,
        });
        if (result.affected && result.affected > 0) {
            this.logger.log(`Marked ${result.affected} users as offline.`);
        }
    }
};
exports.UserStatusTaskService = UserStatusTaskService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserStatusTaskService.prototype, "handleCron", null);
exports.UserStatusTaskService = UserStatusTaskService = UserStatusTaskService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserStatusTaskService);
//# sourceMappingURL=user-status-task.service.js.map