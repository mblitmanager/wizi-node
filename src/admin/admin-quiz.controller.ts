import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
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

@Controller("admin/quiz")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminQuizController {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>
  ) {}

  @Get()
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.quizRepository.createQueryBuilder("q")
      .leftJoinAndSelect("q.questions", "questions")
      .leftJoinAndSelect("q.formations", "formations");

    if (search) {
      query.where("q.title LIKE :search OR q.description LIKE :search", {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("q.id", "DESC")
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

  @Post(":id/duplicate")
  async duplicate(@Param("id") id: number) {
    const original = await this.quizRepository.findOne({
      where: { id },
      relations: ["questions", "questions.reponses"],
    });

    if (!original) {
      throw new Error("Quiz not found");
    }

    const newQuiz = this.quizRepository.create({
      ...original,
      title: `${original.title} (Copie)`,
      id: undefined,
    });

    return this.quizRepository.save(newQuiz);
  }

  @Patch(":id/enable")
  async enable(@Param("id") id: number) {
    await this.quizRepository.update(id, { statut: 1 });
    return this.findOne(id);
  }

  @Patch(":id/disable")
  async disable(@Param("id") id: number) {
    await this.quizRepository.update(id, { statut: 0 });
    return this.findOne(id);
  }
}
