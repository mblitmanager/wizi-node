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
import { Quiz } from "../entities/quiz.entity";

@Controller("admin/quizzes")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminQuizController {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>
  ) {}

  @Get()
  async findAll(@Query("page") page = 1, @Query("limit") limit = 10) {
    const [data, total] = await this.quizRepository.findAndCount({
      relations: ["questions", "formations"],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: "DESC" },
    });

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    return this.quizRepository.findOne({
      where: { id },
      relations: ["questions", "questions.reponses", "formations"],
    });
  }

  @Post()
  async create(@Body() data: any) {
    const quiz = this.quizRepository.create(data);
    return this.quizRepository.save(quiz);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    await this.quizRepository.update(id, data);
    return this.findOne(id);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return this.quizRepository.delete(id);
  }
}
