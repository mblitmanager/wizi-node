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
import { Formateur } from "../entities/formateur.entity";

@Controller("admin/formateurs")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminFormateurController {
  constructor(
    @InjectRepository(Formateur)
    private formateurRepository: Repository<Formateur>
  ) {}

  @Get()
  async findAll(@Query("page") page = 1, @Query("limit") limit = 10) {
    const [data, total] = await this.formateurRepository.findAndCount({
      relations: ["user", "stagiaires", "formations"],
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
    return this.formateurRepository.findOne({
      where: { id },
      relations: ["user", "stagiaires", "formations"],
    });
  }

  @Post()
  async create(@Body() data: any) {
    const formateur = this.formateurRepository.create(data);
    return this.formateurRepository.save(formateur);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    await this.formateurRepository.update(id, data);
    return this.findOne(id);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return this.formateurRepository.delete(id);
  }
}
