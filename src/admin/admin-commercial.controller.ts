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
  Patch,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Commercial } from "../entities/commercial.entity";

@Controller("administrateur/commercials")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminCommercialController {
  constructor(
    @InjectRepository(Commercial)
    private commercialRepository: Repository<Commercial>
  ) {}

  @Get()
  async index(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.commercialRepository.createQueryBuilder("c");

    if (search) {
      query.where("c.name LIKE :search OR c.email LIKE :search", {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("c.id", "DESC")
      .getManyAndCount();

    return {
      data,
      pagination: { total, page, total_pages: Math.ceil(total / limit) },
    };
  }

  @Get("create")
  async create() {
    return { message: "Create commercial form" };
  }

  @Post()
  async store(@Body() data: any) {
    const commercial = this.commercialRepository.create(data);
    return this.commercialRepository.save(commercial);
  }

  @Get(":commercial")
  async show(@Param("commercial") id: number) {
    return this.commercialRepository.findOne({ where: { id } });
  }

  @Get(":commercial/edit")
  async edit(@Param("commercial") id: number) {
    const commercial = await this.commercialRepository.findOne({
      where: { id },
    });
    return { form: commercial };
  }

  @Put(":commercial")
  async update(@Param("commercial") id: number, @Body() data: any) {
    await this.commercialRepository.update(id, data);
    return this.commercialRepository.findOne({ where: { id } });
  }

  @Patch(":commercial")
  async patch(@Param("commercial") id: number, @Body() data: any) {
    await this.commercialRepository.update(id, data);
    return this.commercialRepository.findOne({ where: { id } });
  }

  @Delete(":commercial")
  async destroy(@Param("commercial") id: number) {
    return this.commercialRepository.delete(id);
  }
}
