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
  constructor(private apiResponse: ApiResponseService) {}

  @Get()
  async index() {
    return this.apiResponse.success([]);
  }

  @Get(":id")
  async show(@Param("id") id: number) {
    return this.apiResponse.success({ id });
  }
}

@Controller("administrateur/partenaires")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminPartenaireController {
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

  @Post("import")
  async import(@Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Get(":partenaire")
  async show(@Param("partenaire") id: number) {
    return this.apiResponse.success({ id });
  }

  @Put(":partenaire")
  async update(@Param("partenaire") id: number, @Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Delete(":partenaire")
  async destroy(@Param("partenaire") id: number) {
    return this.apiResponse.success();
  }

  @Get(":partenaire/classements")
  async classements(@Param("partenaire") id: number) {
    return this.apiResponse.success({ id });
  }
}

@Controller("administrateur/medias")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminMediasController {
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

  @Get(":media")
  async show(@Param("media") id: number) {
    return this.apiResponse.success({ id });
  }

  @Put(":media")
  async update(@Param("media") id: number, @Body() data: any) {
    return this.apiResponse.success(data);
  }

  @Delete(":media")
  async destroy(@Param("media") id: number) {
    return this.apiResponse.success();
  }
}
