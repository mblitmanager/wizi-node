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
exports.SyncAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
let SyncAuthGuard = class SyncAuthGuard extends (0, passport_1.AuthGuard)("jwt") {
    constructor(configService) {
        super();
        this.configService = configService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const secret = request.headers["x-sync-secret"];
        const validSecret = this.configService.get("SYNC_API_SECRET");
        if (secret && validSecret && secret === validSecret) {
            return true;
        }
        try {
            const result = (await super.canActivate(context));
            return result;
        }
        catch (e) {
            throw new common_1.UnauthorizedException();
        }
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new common_1.UnauthorizedException();
        }
        return user;
    }
};
exports.SyncAuthGuard = SyncAuthGuard;
exports.SyncAuthGuard = SyncAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SyncAuthGuard);
//# sourceMappingURL=sync-auth.guard.js.map