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
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("administrateur/parametre")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminParametreController {
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

  @Get(":parametre")
  async show(@Param("parametre") id: number) {
    return this.apiResponse.success({ id });
  }

  @Put(":parametre")
  async update(@Param("parametre") id: number, @Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Delete(":parametre")
  async destroy(@Param("parametre") id: number) {
    return this.apiResponse.success();
  }

  @Post("reset-data")
  async resetData() {
    return this.apiResponse.success();
  }

  @Put(":id/update-image")
  async updateImage(@Param("id") id: number, @Body() data: any) {
    return this.apiResponse.success(data);
  }
}

@Controller("administrateur/classements")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminClassementController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get()
  async index() {
    return this.apiResponse.success([]);
  }
}

@Controller("administrateur/parrainage")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminParrainageController {
  constructor() {}

  @Get()
  async index() {
    return { data: [], message: "Parrainage list" };
  }

  @Get(":id")
  async show(@Param("id") id: number) {
    return { id, message: "Parrainage details" };
  }
}

@Controller("administrateur/partenaires")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminPartenaireController {
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
    return { message: "Create partenaire form" };
  }

  @Post()
  async store(@Body() data: any) {
    return { message: "Partenaire created", data };
  }

  @Post("import")
  async import(@Body() data: any) {
    return { message: "Partenaires imported", data };
  }

  @Get(":partenaire")
  async show(@Param("partenaire") id: number) {
    return { id, message: "Partenaire details" };
  }

  @Get(":partenaire/edit")
  async edit(@Param("partenaire") id: number) {
    return { id, message: "Edit partenaire form" };
  }

  @Put(":partenaire")
  async update(@Param("partenaire") id: number, @Body() data: any) {
    return { id, message: "Partenaire updated", data };
  }

  @Delete(":partenaire")
  async destroy(@Param("partenaire") id: number) {
    return { id, message: "Partenaire deleted" };
  }

  @Get(":partenaire/classements")
  async classements(@Param("partenaire") id: number) {
    return { id, message: "Partenaire classements" };
  }
}

@Controller("administrateur/medias")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminMediasController {
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
    return { message: "Create media form" };
  }

  @Post()
  async store(@Body() data: any) {
    return { message: "Media created", data };
  }

  @Get(":media")
  async show(@Param("media") id: number) {
    return { id, message: "Media details" };
  }

  @Get(":media/edit")
  async edit(@Param("media") id: number) {
    return { id, message: "Edit media form" };
  }

  @Put(":media")
  async update(@Param("media") id: number, @Body() data: any) {
    return { id, message: "Media updated", data };
  }

  @Delete(":media")
  async destroy(@Param("media") id: number) {
    return { id, message: "Media deleted" };
  }
}
