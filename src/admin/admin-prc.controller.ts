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
import { PoleRelationClient } from "../entities/pole-relation-client.entity";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("administrateur/pole_relation_clients")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminPoleRelationClientController {
  constructor(
    @InjectRepository(PoleRelationClient)
    private prcRepository: Repository<PoleRelationClient>,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async index(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.prcRepository.createQueryBuilder("prc");

    if (search) {
      query.where("prc.name LIKE :search OR prc.email LIKE :search", {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("prc.id", "DESC")
      .getManyAndCount();

    return this.apiResponse.paginated(data, total, page, limit);
  }

  @Post()
  async store(@Body() data: any) {
    if (!data.name) {
      throw new BadRequestException("name est obligatoire");
    }

    const prc = this.prcRepository.create(data);
    const saved = await this.prcRepository.save(prc);

    return this.apiResponse.success(saved);
  }

  @Get(":pole_relation_client")
  async show(@Param("pole_relation_client") id: number) {
    const prc = await this.prcRepository.findOne({ where: { id } });

    if (!prc) {
      throw new NotFoundException("PRC non trouvé");
    }

    return this.apiResponse.success(prc);
  }

  @Put(":pole_relation_client")
  async update(
    @Param("pole_relation_client") id: number,
    @Body() data: any
  ) {
    const prc = await this.prcRepository.findOne({ where: { id } });

    if (!prc) {
      throw new NotFoundException("PRC non trouvé");
    }

    await this.prcRepository.update(id, data);
    const updated = await this.prcRepository.findOne({ where: { id } });

    return this.apiResponse.success(updated);
  }

  @Delete(":pole_relation_client")
  async destroy(@Param("pole_relation_client") id: number) {
    const prc = await this.prcRepository.findOne({ where: { id } });

    if (!prc) {
      throw new NotFoundException("PRC non trouvé");
    }

    await this.prcRepository.delete(id);

    return this.apiResponse.success();
  }
}
