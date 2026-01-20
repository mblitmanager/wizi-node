"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const api_response_service_1 = require("./services/api-response.service");
const all_exceptions_filter_1 = require("./filters/all-exceptions.filter");
const s3_storage_service_1 = require("./services/s3-storage.service");
const user_presence_interceptor_1 = require("./interceptors/user-presence.interceptor");
const user_status_task_service_1 = require("./services/user-status-task.service");
const user_entity_1 = require("../entities/user.entity");
const docs_controller_1 = require("./docs.controller");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Module)({
        imports: [schedule_1.ScheduleModule.forRoot(), typeorm_1.TypeOrmModule.forFeature([user_entity_1.User])],
        providers: [
            api_response_service_1.ApiResponseService,
            all_exceptions_filter_1.AllExceptionsFilter,
            s3_storage_service_1.S3StorageService,
            user_presence_interceptor_1.UserPresenceInterceptor,
            user_status_task_service_1.UserStatusTaskService,
        ],
        controllers: [docs_controller_1.DocsController, docs_controller_1.DocsLdController],
        exports: [
            api_response_service_1.ApiResponseService,
            all_exceptions_filter_1.AllExceptionsFilter,
            s3_storage_service_1.S3StorageService,
            user_presence_interceptor_1.UserPresenceInterceptor,
            user_status_task_service_1.UserStatusTaskService,
        ],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map