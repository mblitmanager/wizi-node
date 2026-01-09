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
import { Stagiaire } from "../entities/stagiaire.entity";

@Controller("admin/stagiaires")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminStagiaireController {
  constructor(
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>
  ) {}

  @Get()
  async findAll(@Query("page") page = 1, @Query("limit") limit = 10) {
    const [data, total] = await this.stagiaireRepository.findAndCount({
      relations: ["user", "catalogue_formations"],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: "DESC" },
    });

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    return this.stagiaireRepository.findOne({
      where: { id },
      relations: ["user", "catalogue_formations", "achievements"],
    });
  }

  @Post()
  async create(@Body() data: any) {
    const stagiaire = this.stagiaireRepository.create(data);
    return this.stagiaireRepository.save(stagiaire);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    await this.stagiaireRepository.update(id, data);
    return this.findOne(id);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return this.stagiaireRepository.delete(id);
  }
}
