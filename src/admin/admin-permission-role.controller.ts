import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiResponseService } from "../common/services/api-response.service";

// Placeholder entities pour permissions/roles
@Controller("admin/permissions")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminPermissionController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get()
  async index(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    return this.apiResponse.paginated([], 0, page, limit);
  }

  @Post()
  async store(@Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Get(":permission")
  async show(@Param("permission") id: number) {
    return this.apiResponse.success({ id });
  }

  @Put(":permission")
  async update(@Param("permission") id: number, @Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Delete(":permission")
  async destroy(@Param("permission") id: number) {
    return this.apiResponse.success();
  }

  @Post(":permission/toggle-status")
  async toggleStatus(@Param("permission") id: number) {
    return this.apiResponse.success({ id });
  }
}

@Controller("admin/roles")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminRoleController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get()
  async index(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    return this.apiResponse.paginated([], 0, page, limit);
  }

  @Post()
  async store(@Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Get(":role")
  async show(@Param("role") id: number) {
    return this.apiResponse.success({ id });
  }

  @Put(":role")
  async update(@Param("role") id: number, @Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Delete(":role")
  async destroy(@Param("role") id: number) {
    return this.apiResponse.success();
  }

  @Post(":role/toggle-status")
  async toggleStatus(@Param("role") id: number) {
    return this.apiResponse.success({ id });
  }
}
