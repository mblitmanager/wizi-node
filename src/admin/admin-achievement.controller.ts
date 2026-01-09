import {
  Controller,
  Get,
  Delete,
  UseGuards,
  Query,
  Param,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Achievement } from "../entities/achievement.entity";

@Controller("admin/achievements")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminAchievementController {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>
  ) {}

  @Get()
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.achievementRepository.createQueryBuilder("a");

    if (search) {
      query.where("a.titre LIKE :search OR a.description LIKE :search", {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("a.id", "DESC")
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

  @Delete(":id")
  async delete(@Param("id") id: number) {
    await this.achievementRepository.delete(id);
    return { success: true };
  }
}
