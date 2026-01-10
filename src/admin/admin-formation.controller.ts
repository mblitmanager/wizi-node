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
import { Formation } from "../entities/formation.entity";

@Controller("admin/formations")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminFormationController {
  constructor(
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>
  ) {}

  @Get()
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.formationRepository
      .createQueryBuilder("cf")
      .leftJoinAndSelect("cf.medias", "medias")
      .leftJoinAndSelect("cf.quizzes", "quizzes");

    if (search) {
      query.where("cf.titre LIKE :search OR cf.description LIKE :search", {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("cf.id", "DESC")
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

  @Post(":id/duplicate")
  async duplicate(@Param("id") id: number) {
    const original = await this.formationRepository.findOne({
      where: { id },
      relations: ["medias", "quizzes"],
    });

    if (!original) {
      throw new Error("Formation not found");
    }

    const newFormation = this.formationRepository.create({
      ...original,
      titre: `${original.titre} (Copie)`,
      id: undefined,
    });

    return this.formationRepository.save(newFormation);
  }
}
