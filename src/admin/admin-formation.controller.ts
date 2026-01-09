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
import { CatalogueFormation } from "../entities/catalogue-formation.entity";

@Controller("admin/formations")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminFormationController {
  constructor(
    @InjectRepository(CatalogueFormation)
    private formationRepository: Repository<CatalogueFormation>
  ) {}

  @Get()
  async findAll(@Query("page") page = 1, @Query("limit") limit = 10) {
    const [data, total] = await this.formationRepository.findAndCount({
      relations: ["medias", "quizzes"],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: "DESC" },
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
    return this.formationRepository.findOne({
      where: { id },
      relations: ["medias", "quizzes", "stagiaires"],
    });
  }

  @Post()
  async create(@Body() data: any) {
    const formation = this.formationRepository.create(data);
    return this.formationRepository.save(formation);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    await this.formationRepository.update(id, data);
    return this.findOne(id);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return this.formationRepository.delete(id);
  }
}
