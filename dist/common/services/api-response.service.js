"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseService = void 0;
const common_1 = require("@nestjs/common");
let ApiResponseService = class ApiResponseService {
    success(data, message) {
        if (data === undefined) {
            return { success: true };
        }
        return { data };
    }
    error(message, statusCode = 400) {
        return {
            success: false,
            error: message,
            status: statusCode,
        };
    }
    list(data, message) {
        return data;
    }
    paginated(data, total, currentPage = 1, perPage = 15) {
        return {
            data,
            pagination: {
                total,
                count: data.length,
                per_page: perPage,
                current_page: currentPage,
                total_pages: Math.ceil(total / perPage),
            },
        };
    }
    transform(laravelResponse) {
        if (Array.isArray(laravelResponse)) {
            return laravelResponse;
        }
        if (laravelResponse?.data) {
            return laravelResponse.data;
        }
        return laravelResponse;
    }
    file(url, filename) {
        return {
            success: true,
            data: { image: url, filename },
        };
    }
    token(token) {
        return { token };
    }
    user(user) {
        return user;
    }
};
exports.ApiResponseService = ApiResponseService;
exports.ApiResponseService = ApiResponseService = __decorate([
    (0, common_1.Injectable)()
], ApiResponseService);
//# sourceMappingURL=api-response.service.js.map