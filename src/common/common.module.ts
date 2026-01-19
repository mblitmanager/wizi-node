import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiResponseService } from "./services/api-response.service";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";
import { S3StorageService } from "./services/s3-storage.service";
import { UserPresenceInterceptor } from "./interceptors/user-presence.interceptor";
import { UserStatusTaskService } from "./services/user-status-task.service";
import { User } from "../entities/user.entity";

import { DocsController, DocsLdController } from "./docs.controller";

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([User])],
  providers: [
    ApiResponseService,
    AllExceptionsFilter,
    S3StorageService,
    UserPresenceInterceptor,
    UserStatusTaskService,
  ],
  controllers: [DocsController, DocsLdController],
  exports: [
    ApiResponseService,
    AllExceptionsFilter,
    S3StorageService,
    UserPresenceInterceptor,
    UserStatusTaskService,
  ],
})
export class CommonModule {}
