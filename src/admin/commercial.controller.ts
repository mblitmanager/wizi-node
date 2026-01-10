import { Controller, Get, Post, Put, Delete, UseGuards, Body, Param, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Commercial } from "../entities/commercial.entity";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("admin/commerciaux")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class CommercialController {
  constructor(
    @InjectRepository(Commercial)
    private commercialRepository: Repository<Commercial>,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.commercialRepository.createQueryBuilder("c")
      .leftJoinAndSelect("c.user", "user")
      .leftJoinAndSelect("c.stagiaires", "stagiaires");

    if (search) {
      query.where("c.prenom LIKE :search OR user.email LIKE :search", {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("c.created_at", "DESC")
      .getManyAndCount();

    return this.apiResponse.paginated(data, total, page, limit);
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const commercial = await this.commercialRepository.findOne({
      where: { id },
      relations: ["user", "stagiaires"],
    });
    return this.apiResponse.success(commercial);
  }

  @Post()
  async create(@Body() data: any) {
    const commercial = this.commercialRepository.create(data);
    const saved = await this.commercialRepository.save(commercial);
    return this.apiResponse.success(saved);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    await this.commercialRepository.update(id, data);
    const updated = await this.findOne(id);
    return updated;
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    await this.commercialRepository.delete(id);
    return this.apiResponse.success();
  }
}
