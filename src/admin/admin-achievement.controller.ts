import {
  Controller,
  Get,
  Delete,
  UseGuards,
  Query,
  Param,
  NotFoundException,
  Post,
  Body,
  Put,
  BadRequestException,
} from "@nestjs/common";
import * as fs from "fs";
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
    try {
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
    } catch (error) {
      fs.appendFileSync(
        "debug_500_errors.log",
        `[AdminAchievementController] Error: ${error.message}\nStack: ${error.stack}\n\n`
      );
      console.error("Error in findAll achievements:", error);
      return this.apiResponse.paginated([], 0, page, limit);
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const achievement = await this.achievementRepository.findOne({
      where: { id },
    });

    if (!achievement) {
      throw new NotFoundException("Achievement not found");
    }

    return this.apiResponse.success(achievement);
  }

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      description?: string;
      icon?: string;
      level?: string;
    }
  ) {
    if (!body.name) {
      throw new BadRequestException("name is required");
    }

    const achievement = this.achievementRepository.create({
      name: body.name,
      description: body.description ?? "",
      icon: body.icon ?? "gold",
      level: body.level ?? null,
    });

    const saved = await this.achievementRepository.save(achievement);
    return this.apiResponse.success(saved);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body()
    body: {
      name?: string;
      description?: string;
      icon?: string;
      level?: string;
    }
  ) {
    const achievement = await this.achievementRepository.findOne({
      where: { id },
    });

    if (!achievement) {
      throw new NotFoundException("Achievement not found");
    }

    if (body.name !== undefined) {
      achievement.name = body.name;
    }
    if (body.description !== undefined) {
      achievement.description = body.description;
    }
    if (body.icon !== undefined) {
      achievement.icon = body.icon;
    }
    if (body.level !== undefined) {
      achievement.level = body.level;
    }

    const updated = await this.achievementRepository.save(achievement);
    return this.apiResponse.success(updated);
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
