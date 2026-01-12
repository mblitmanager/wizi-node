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
import { Formateur } from "../entities/formateur.entity";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("admin/formateur")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminFormateurController {
  constructor(
    @InjectRepository(Formateur)
    private formateurRepository: Repository<Formateur>,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.formateurRepository
      .createQueryBuilder("f")
      .leftJoinAndSelect("f.user", "user")
      .leftJoinAndSelect("f.stagiaires", "stagiaires")
      .leftJoinAndSelect("f.formations", "formations");

    if (search) {
      query.where("f.prenom LIKE :search OR user.email LIKE :search", {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("f.created_at", "DESC")
      .getManyAndCount();

    return this.apiResponse.paginated(data, total, page, limit);
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const formateur = await this.formateurRepository.findOne({
      where: { id },
      relations: ["user", "stagiaires", "formations"],
    });

    if (!formateur) {
      throw new NotFoundException("Formateur non trouvé");
    }

    return this.apiResponse.success(formateur);
  }

  @Post()
  async create(@Body() data: any) {
    if (!data.prenom || !data.nom) {
      throw new BadRequestException("prenom et nom sont obligatoires");
    }

    const formateur = this.formateurRepository.create(data);
    const saved = await this.formateurRepository.save(formateur);

    return this.apiResponse.success(saved);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    const formateur = await this.formateurRepository.findOne({
      where: { id },
    });

    if (!formateur) {
      throw new NotFoundException("Formateur non trouvé");
    }

    await this.formateurRepository.update(id, data);
    const updated = await this.formateurRepository.findOne({
      where: { id },
      relations: ["user", "stagiaires", "formations"],
    });

    return this.apiResponse.success(updated);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    const formateur = await this.formateurRepository.findOne({
      where: { id },
    });

    if (!formateur) {
      throw new NotFoundException("Formateur non trouvé");
    }

    await this.formateurRepository.delete(id);

    return this.apiResponse.success();
  }
}
