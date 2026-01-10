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

@Controller("admin/catalogue-formations")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminCatalogueController {
  constructor(
    @InjectRepository(CatalogueFormation)
    private catalogueRepository: Repository<CatalogueFormation>,
    private apiResponse: ApiResponseService
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

    return this.apiResponse.paginated(data, total, page, limit);
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const catalogue = await this.catalogueRepository.findOne({
      where: { id },
      relations: ["formation", "stagiaires"],
    });

    if (!catalogue) {
      throw new NotFoundException("Catalogue not found");
    }

    return this.apiResponse.success(catalogue);
  }

  @Post()
  async create(@Body() body: any) {
    if (!body.titre) {
      throw new BadRequestException("titre is required");
    }

    const catalogue = this.catalogueRepository.create(body);
    const saved = await this.catalogueRepository.save(catalogue);

    return this.apiResponse.success(saved);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() body: any) {
    const catalogue = await this.catalogueRepository.findOne({
      where: { id },
    });

    if (!catalogue) {
      throw new NotFoundException("Catalogue not found");
    }

    await this.catalogueRepository.update(id, body);
    const updated = await this.catalogueRepository.findOne({
      where: { id },
      relations: ["formation", "stagiaires"],
    });

    return this.apiResponse.success(updated);
  }

  @Delete(":id")
  async delete(@Param("id") id: number) {
    const catalogue = await this.catalogueRepository.findOne({
      where: { id },
    });

    if (!catalogue) {
      throw new NotFoundException("Catalogue not found");
    }

    await this.catalogueRepository.delete(id);

    return this.apiResponse.success();
  }

  @Post(":id/duplicate")
  async duplicate(@Param("id") id: number) {
    const original = await this.catalogueRepository.findOne({
      where: { id },
      relations: ["formation", "stagiaires"],
    });

    if (!original) {
      throw new NotFoundException("Catalogue not found");
    }

    const newCatalogue = this.catalogueRepository.create({
      ...original,
      titre: `${original.titre} (Copie)`,
    });

    const saved = await this.catalogueRepository.save(newCatalogue);

    return this.apiResponse.success(saved);
  }

  @Get(":id/download-pdf")
  async downloadPdf(@Param("id") id: number) {
    const catalogue = await this.catalogueRepository.findOne({
      where: { id },
    });

    if (!catalogue) {
      throw new NotFoundException("Catalogue not found");
    }

    // Return base64 encoded PDF or generate one
    return this.apiResponse.success({
      filename: `${catalogue.titre}.pdf`,
      content: Buffer.from("PDF content here").toString("base64"),
    });
  }
}
