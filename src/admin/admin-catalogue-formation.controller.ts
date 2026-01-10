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

@Controller("administrateur/catalogue_formation")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminCatalogueFormationController {
  constructor(
    @InjectRepository(CatalogueFormation)
    private catalogueRepository: Repository<CatalogueFormation>
  ) {}

  @Get()
  async index(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.catalogueRepository
      .createQueryBuilder("cf")
      .leftJoinAndSelect("cf.formations", "formations");

    if (search) {
      query.where(
        "cf.titre LIKE :search OR cf.description LIKE :search",
        {
          search: `%${search}%`,
        }
      );
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("cf.id", "DESC")
      .getManyAndCount();

    return {
      data,
      pagination: { total, page, total_pages: Math.ceil(total / limit) },
    };
  }

  @Get("create")
  async create() {
    return { message: "Create catalogue formation form" };
  }

  @Post()
  async store(@Body() data: any) {
    const catalogue = this.catalogueRepository.create(data);
    return this.catalogueRepository.save(catalogue);
  }

  @Get(":id")
  async show(@Param("id") id: number) {
    return this.catalogueRepository.findOne({
      where: { id },
      relations: ["formations"],
    });
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
    await this.catalogueRepository.update(id, data);
    return this.catalogueRepository.findOne({ where: { id } });
  }

  @Delete(":catalogue_formation")
  async destroy(@Param("catalogue_formation") id: number) {
    return this.catalogueRepository.delete(id);
  }

  @Post(":id/duplicate")
  async duplicate(@Param("id") id: number) {
    const original = await this.catalogueRepository.findOne({
      where: { id },
      relations: ["formations"],
    });

    if (!original) throw new Error("Catalogue not found");

    const newCatalogue = this.catalogueRepository.create({
      ...original,
      titre: `${original.titre} (Copie)`,
      id: undefined,
    });

    return this.catalogueRepository.save(newCatalogue);
  }

  @Get(":id/download-pdf")
  async downloadPdf(@Param("id") id: number) {
    return { message: "PDF download for catalogue", catalogueId: id };
  }
}
