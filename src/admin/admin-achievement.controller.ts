import {
  Controller,
  Get,
  Delete,
  UseGuards,
  Query,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Achievement } from "../entities/achievement.entity";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("admin/achievements")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminAchievementController {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.achievementRepository.createQueryBuilder("a");

    if (search) {
      query.where("a.name LIKE :search OR a.description LIKE :search", {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("a.id", "DESC")
      .getManyAndCount();

    return this.apiResponse.paginated(data, total, page, limit);
  }

  @Delete(":id")
  async delete(@Param("id") id: number) {
    const achievement = await this.achievementRepository.findOne({
      where: { id },
    });

    if (!achievement) {
      throw new NotFoundException("Achievement not found");
    }

    await this.achievementRepository.delete(id);
    return this.apiResponse.success();
  }
}
