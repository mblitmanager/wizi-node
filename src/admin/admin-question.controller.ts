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
import { Question } from "../entities/question.entity";

@Controller("admin/questions")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminQuestionController {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>
  ) {}

  @Get()
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.questionRepository.createQueryBuilder("q")
      .leftJoinAndSelect("q.reponses", "reponses")
      .leftJoinAndSelect("q.quiz", "quiz");

    if (search) {
      query.where("q.texte LIKE :search", { search: `%${search}%` });
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
    return this.questionRepository.findOne({
      where: { id },
      relations: ["reponses", "quiz"],
    });
  }

  @Post()
  async create(@Body() data: any) {
    const question = this.questionRepository.create(data);
    return this.questionRepository.save(question);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    await this.questionRepository.update(id, data);
    return this.findOne(id);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return this.questionRepository.delete(id);
  }
}
