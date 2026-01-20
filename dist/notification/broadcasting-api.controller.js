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
exports.BroadcastingApiController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const api_response_service_1 = require("../common/services/api-response.service");
let BroadcastingApiController = class BroadcastingApiController {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    async auth(req, body) {
        const { socket_id, channel_name } = body;
        const user = req.user;
        return {
            auth: "mock_auth_token:" + user.id + ":" + socket_id,
            channel_data: JSON.stringify({
                user_id: user.id,
                user_info: {
                    name: user.name,
                    role: user.role,
                },
            }),
        };
    }
};
exports.BroadcastingApiController = BroadcastingApiController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.Post)("auth"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BroadcastingApiController.prototype, "auth", null);
exports.BroadcastingApiController = BroadcastingApiController = __decorate([
    (0, common_1.Controller)("broadcasting"),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], BroadcastingApiController);
//# sourceMappingURL=broadcasting-api.controller.js.map