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
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("admin/catalogue_formation")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminCatalogueFormationController {
  constructor(
    @InjectRepository(CatalogueFormation)
    private catalogueRepository: Repository<CatalogueFormation>,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async index(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search: string = ""
  ) {
    const query = this.catalogueRepository
      .createQueryBuilder("cf")
      .leftJoinAndSelect("cf.formations", "formations");

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

  @Get("create")
  async create() {
    return { message: "Create catalogue formation form" };
  }

  @Post()
  async store(@Body() data: any) {
    if (!data.titre) {
      throw new BadRequestException("titre est obligatoire");
    }

    const catalogue = this.catalogueRepository.create(data);
    const saved = await this.catalogueRepository.save(catalogue);

    return this.apiResponse.success(saved);
  }

  @Get(":id")
  async show(@Param("id") id: number) {
    const catalogue = await this.catalogueRepository.findOne({
      where: { id },
      relations: ["formations"],
    });

    if (!catalogue) {
      throw new NotFoundException("Catalogue formation non trouvé");
    }

    return this.apiResponse.success(catalogue);
  }

  @Get(":id/edit")
  async edit(@Param("id") id: number) {
    const catalogue = await this.catalogueRepository.findOne({
      where: { id },
      relations: ["formations"],
    });
    return { form: catalogue };
  }

  @Put(":catalogue_formation")
  async update(@Param("catalogue_formation") id: number, @Body() data: any) {
    const catalogue = await this.catalogueRepository.findOne({
      where: { id },
    });

    if (!catalogue) {
      throw new NotFoundException("Catalogue formation non trouvé");
    }

    await this.catalogueRepository.update(id, data);
    const updated = await this.catalogueRepository.findOne({
      where: { id },
      relations: ["formations"],
    });

    return this.apiResponse.success(updated);
  }

  @Delete(":catalogue_formation")
  async destroy(@Param("catalogue_formation") id: number) {
    const catalogue = await this.catalogueRepository.findOne({
      where: { id },
    });

    if (!catalogue) {
      throw new NotFoundException("Catalogue formation non trouvé");
    }

    await this.catalogueRepository.delete(id);

    return this.apiResponse.success();
  }

  @Post(":id/duplicate")
  async duplicate(@Param("id") id: number) {
    const original = await this.catalogueRepository.findOne({
      where: { id },
      relations: ["formations"],
    });

    if (!original) {
      throw new NotFoundException("Catalogue formation non trouvé");
    }

    const newCatalogue = this.catalogueRepository.create({
      ...original,
      titre: `${original.titre} (Copie)`,
      id: undefined,
    });

    const saved = await this.catalogueRepository.save(newCatalogue);

    return this.apiResponse.success(saved);
  }

  @Get(":id/download-pdf")
  async downloadPdf(@Param("id") id: number) {
    return { message: "PDF download for catalogue", catalogueId: id };
  }
}
