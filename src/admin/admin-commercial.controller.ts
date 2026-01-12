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
  Patch,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Commercial } from "../entities/commercial.entity";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("admin/commercials")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminCommercialController {
  constructor(
    @InjectRepository(Commercial)
    private commercialRepository: Repository<Commercial>,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async index(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.commercialRepository.createQueryBuilder("c");

    if (search) {
      query.where("c.name LIKE :search OR c.email LIKE :search", {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("c.id", "DESC")
      .getManyAndCount();

    return this.apiResponse.paginated(data, total, page, limit);
  }

  @Post()
  async store(@Body() data: any) {
    if (!data.name || !data.email) {
      throw new BadRequestException("name et email sont obligatoires");
    }

    const commercial = this.commercialRepository.create(data);
    const saved = await this.commercialRepository.save(commercial);

    return this.apiResponse.success(saved);
  }

  @Get(":commercial")
  async show(@Param("commercial") id: number) {
    const commercial = await this.commercialRepository.findOne({
      where: { id },
    });

    if (!commercial) {
      throw new NotFoundException("Commercial non trouvé");
    }

    return this.apiResponse.success(commercial);
  }

  @Put(":commercial")
  async update(@Param("commercial") id: number, @Body() data: any) {
    const commercial = await this.commercialRepository.findOne({
      where: { id },
    });

    if (!commercial) {
      throw new NotFoundException("Commercial non trouvé");
    }

    await this.commercialRepository.update(id, data);
    const updated = await this.commercialRepository.findOne({
      where: { id },
    });

    return this.apiResponse.success(updated);
  }

  @Patch(":commercial")
  async patch(@Param("commercial") id: number, @Body() data: any) {
    const commercial = await this.commercialRepository.findOne({
      where: { id },
    });

    if (!commercial) {
      throw new NotFoundException("Commercial non trouvé");
    }

    await this.commercialRepository.update(id, data);
    const updated = await this.commercialRepository.findOne({
      where: { id },
    });

    return this.apiResponse.success(updated);
  }

  @Delete(":commercial")
  async destroy(@Param("commercial") id: number) {
    const commercial = await this.commercialRepository.findOne({
      where: { id },
    });

    if (!commercial) {
      throw new NotFoundException("Commercial non trouvé");
    }

    await this.commercialRepository.delete(id);

    return this.apiResponse.success();
  }
}
