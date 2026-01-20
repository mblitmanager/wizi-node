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
exports.UserPresenceInterceptor = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
let UserPresenceInterceptor = class UserPresenceInterceptor {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user && user.id) {
            console.log(`[DEBUG] Updating presence for user ${user.id} (${user.email || "no email"})`);
            this.userRepository
                .update(user.id, {
                is_online: true,
                last_activity_at: new Date(),
            })
                .then(() => {
            })
                .catch((err) => console.error(`[ERROR] Failed to update presence for user ${user.id}:`, err));
        }
        else {
        }
        return next.handle();
    }
};
exports.UserPresenceInterceptor = UserPresenceInterceptor;
exports.UserPresenceInterceptor = UserPresenceInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserPresenceInterceptor);
//# sourceMappingURL=user-presence.interceptor.js.map