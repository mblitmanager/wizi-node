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
import { Question } from "../entities/question.entity";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("administrateur/question")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminQuestionController {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search = ""
  ) {
    const query = this.questionRepository
      .createQueryBuilder("q")
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

    return this.apiResponse.paginated(data, total, page, limit);
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ["reponses", "quiz"],
    });

    if (!question) {
      throw new NotFoundException("Question not found");
    }

    return this.apiResponse.success(question);
  }

  @Post()
  async create(@Body() data: any) {
    if (!data.texte) {
      throw new BadRequestException("texte is required");
    }

    const question = this.questionRepository.create(data);
    const saved = await this.questionRepository.save(question);

    return this.apiResponse.success(saved);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    const question = await this.questionRepository.findOne({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException("Question not found");
    }

    await this.questionRepository.update(id, data);
    const updated = await this.questionRepository.findOne({
      where: { id },
      relations: ["reponses", "quiz"],
    });

    return this.apiResponse.success(updated);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException("Question not found");
    }

    await this.questionRepository.delete(id);

    return this.apiResponse.success();
  }
}
