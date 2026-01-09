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

@Controller("admin/catalogue-formations")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminCatalogueController {
  constructor(
    @InjectRepository(CatalogueFormation)
    private catalogueRepository: Repository<CatalogueFormation>
  ) {}

  @Get()
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.catalogueRepository.createQueryBuilder("cf");

    if (search) {
      query.where("cf.titre LIKE :search OR cf.description LIKE :search", {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .leftJoinAndSelect("cf.formation", "formation")
      .leftJoinAndSelect("cf.stagiaires", "stagiaires")
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
    return this.catalogueRepository.findOne({
      where: { id },
      relations: ["formation", "stagiaires"],
    });
  }

  @Post()
  async create(@Body() body: any) {
    const catalogue = this.catalogueRepository.create(body);
    return this.catalogueRepository.save(catalogue);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() body: any) {
    await this.catalogueRepository.update(id, body);
    return this.catalogueRepository.findOne({
      where: { id },
      relations: ["formation", "stagiaires"],
    });
  }

  @Delete(":id")
  async delete(@Param("id") id: number) {
    await this.catalogueRepository.delete(id);
    return { success: true };
  }

  @Post(":id/duplicate")
  async duplicate(@Param("id") id: number) {
    const original = await this.catalogueRepository.findOne({
      where: { id },
      relations: ["formation", "stagiaires"],
    });

    if (!original) {
      throw new Error("Catalogue not found");
    }

    const newCatalogue = this.catalogueRepository.create({
      ...original,
      titre: `${original.titre} (Copie)`,
    });

    return this.catalogueRepository.save(newCatalogue);
  }

  @Get(":id/download-pdf")
  async downloadPdf(@Param("id") id: number) {
    const catalogue = await this.catalogueRepository.findOne({
      where: { id },
    });

    if (!catalogue) {
      throw new Error("Catalogue not found");
    }

    // Return base64 encoded PDF or generate one
    return {
      filename: `${catalogue.titre}.pdf`,
      content: Buffer.from("PDF content here").toString("base64"),
    };
  }
}
