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
import { PoleRelationClient } from "../entities/pole-relation-client.entity";

@Controller("administrateur/pole_relation_clients")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminPoleRelationClientController {
  constructor(
    @InjectRepository(PoleRelationClient)
    private prcRepository: Repository<PoleRelationClient>
  ) {}

  @Get()
  async index(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.prcRepository.createQueryBuilder("prc");

    if (search) {
      query.where("prc.name LIKE :search OR prc.email LIKE :search", {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("prc.id", "DESC")
      .getManyAndCount();

    return {
      data,
      pagination: { total, page, total_pages: Math.ceil(total / limit) },
    };
  }

  @Get("create")
  async create() {
    return { message: "Create PRC form" };
  }

  @Post()
  async store(@Body() data: any) {
    const prc = this.prcRepository.create(data);
    return this.prcRepository.save(prc);
  }

  @Get(":pole_relation_client")
  async show(@Param("pole_relation_client") id: number) {
    return this.prcRepository.findOne({ where: { id } });
  }

  @Get(":pole_relation_client/edit")
  async edit(@Param("pole_relation_client") id: number) {
    const prc = await this.prcRepository.findOne({ where: { id } });
    return { form: prc };
  }

  @Put(":pole_relation_client")
  async update(
    @Param("pole_relation_client") id: number,
    @Body() data: any
  ) {
    await this.prcRepository.update(id, data);
    return this.prcRepository.findOne({ where: { id } });
  }

  @Delete(":pole_relation_client")
  async destroy(@Param("pole_relation_client") id: number) {
    return this.prcRepository.delete(id);
  }
}
