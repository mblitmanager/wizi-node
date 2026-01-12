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
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Formation } from "../entities/formation.entity";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("admin/formations")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminFormationController {
  constructor(
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search: string = ""
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

    return this.apiResponse.paginated(data, total, page, limit);
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const formation = await this.formationRepository.findOne({
      where: { id },
      relations: ["medias", "quizzes", "stagiaires"],
    });

    if (!formation) {
      throw new NotFoundException("Formation non trouvée");
    }

    return this.apiResponse.success(formation);
  }

  @Post()
  async create(@Body() data: any) {
    if (!data.titre) {
      throw new BadRequestException("titre est obligatoire");
    }

    const formation = this.formationRepository.create(data);
    const saved = await this.formationRepository.save(formation);

    return this.apiResponse.success(saved);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    const formation = await this.formationRepository.findOne({
      where: { id },
    });

    if (!formation) {
      throw new NotFoundException("Formation non trouvée");
    }

    await this.formationRepository.update(id, data);
    const updated = await this.formationRepository.findOne({
      where: { id },
      relations: ["medias", "quizzes", "stagiaires"],
    });

    return this.apiResponse.success(updated);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    const formation = await this.formationRepository.findOne({
      where: { id },
    });

    if (!formation) {
      throw new NotFoundException("Formation non trouvée");
    }

    await this.formationRepository.delete(id);

    return this.apiResponse.success();
  }

  @Post(":id/duplicate")
  async duplicate(@Param("id") id: number) {
    const original = await this.formationRepository.findOne({
      where: { id },
      relations: ["medias", "quizzes"],
    });

    if (!original) {
      throw new NotFoundException("Formation non trouvée");
    }

    const newFormation = this.formationRepository.create({
      ...original,
      titre: `${original.titre} (Copie)`,
      id: undefined,
    });

    const saved = await this.formationRepository.save(newFormation);

    return this.apiResponse.success(saved);
  }
}
