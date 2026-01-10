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

// Placeholder entities pour permissions/roles
@Controller("administrateur/permissions")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminPermissionController {
  constructor() {}

  @Get()
  async index(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    return {
      data: [],
      pagination: { total: 0, page, total_pages: 0 },
    };
  }

  @Get("create")
  async create() {
    return { message: "Create permission form" };
  }

  @Post()
  async store(@Body() data: any) {
    return { message: "Permission created", data };
  }

  @Get(":permission")
  async show(@Param("permission") id: number) {
    return { id, message: "Permission details" };
  }

  @Get(":permission/edit")
  async edit(@Param("permission") id: number) {
    return { id, message: "Edit permission form" };
  }

  @Put(":permission")
  async update(@Param("permission") id: number, @Body() data: any) {
    return { id, message: "Permission updated", data };
  }

  @Delete(":permission")
  async destroy(@Param("permission") id: number) {
    return { id, message: "Permission deleted" };
  }

  @Post(":permission/toggle-status")
  async toggleStatus(@Param("permission") id: number) {
    return { id, message: "Permission status toggled" };
  }
}

@Controller("administrateur/roles")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminRoleController {
  constructor() {}

  @Get()
  async index(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    return {
      data: [],
      pagination: { total: 0, page, total_pages: 0 },
    };
  }

  @Get("create")
  async create() {
    return { message: "Create role form" };
  }

  @Post()
  async store(@Body() data: any) {
    return { message: "Role created", data };
  }

  @Get(":role")
  async show(@Param("role") id: number) {
    return { id, message: "Role details" };
  }

  @Get(":role/edit")
  async edit(@Param("role") id: number) {
    return { id, message: "Edit role form" };
  }

  @Put(":role")
  async update(@Param("role") id: number, @Body() data: any) {
    return { id, message: "Role updated", data };
  }

  @Delete(":role")
  async destroy(@Param("role") id: number) {
    return { id, message: "Role deleted" };
  }

  @Post(":role/toggle-status")
  async toggleStatus(@Param("role") id: number) {
    return { id, message: "Role status toggled" };
  }
}
