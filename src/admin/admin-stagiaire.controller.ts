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
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.stagiaireRepository.createQueryBuilder("s")
      .leftJoinAndSelect("s.user", "user")
      .leftJoinAndSelect("s.catalogue_formations", "catalogue_formations");

    if (search) {
      query.where("s.prenom LIKE :search OR s.civilite LIKE :search OR s.ville LIKE :search", {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("s.created_at", "DESC")
      .getManyAndCount();

    return {
      data,
      pagination: {
        total,
        page,
        total_pages: Math.ceil(total / limit),
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
