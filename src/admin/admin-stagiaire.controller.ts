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
import { Stagiaire } from "../entities/stagiaire.entity";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("admin/stagiaires")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminStagiaireController {
  constructor(
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search: string = ""
  ) {
    const query = this.stagiaireRepository
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.user", "user")
      .leftJoinAndSelect("s.stagiaire_catalogue_formations", "scf")
      .leftJoinAndSelect("scf.catalogue_formation", "cf")
      .leftJoinAndSelect("cf.formation", "f");

    if (search) {
      query.where(
        "s.prenom LIKE :search OR s.civilite LIKE :search OR s.ville LIKE :search",
        { search: `%${search}%` }
      );
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("s.created_at", "DESC")
      .getManyAndCount();

    return this.apiResponse.paginated(data, total, page, limit);
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id },
      relations: [
        "user",
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.catalogue_formation",
        "stagiaire_catalogue_formations.catalogue_formation.formation",
        "achievements",
      ],
    });

    if (!stagiaire) {
      throw new NotFoundException("Stagiaire non trouvé");
    }

    return this.apiResponse.success(stagiaire);
  }

  @Post()
  async create(@Body() data: any) {
    if (!data.user_id) {
      throw new BadRequestException("user_id est obligatoire");
    }

    const stagiaire = this.stagiaireRepository.create(data);
    const saved = await this.stagiaireRepository.save(stagiaire);

    return this.apiResponse.success(saved);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id },
    });

    if (!stagiaire) {
      throw new NotFoundException("Stagiaire non trouvé");
    }

    await this.stagiaireRepository.update(id, data);
    const updated = await this.stagiaireRepository.findOne({
      where: { id },
      relations: [
        "user",
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.catalogue_formation",
        "stagiaire_catalogue_formations.catalogue_formation.formation",
        "achievements",
      ],
    });

    return this.apiResponse.success(updated);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id },
    });

    if (!stagiaire) {
      throw new NotFoundException("Stagiaire non trouvé");
    }

    await this.stagiaireRepository.delete(id);

    return this.apiResponse.success();
  }
}
