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
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("admin/quiz")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminQuizController {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search: string = ""
  ) {
    const query = this.quizRepository
      .createQueryBuilder("q")
      .leftJoinAndSelect("q.questions", "questions")
      .leftJoinAndSelect("q.formations", "formations");

    if (search) {
      query.where("q.titre LIKE :search OR q.description LIKE :search", {
        search: `%${search}%`,
      });
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
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ["questions", "questions.reponses", "formations"],
    });

    if (!quiz) {
      throw new NotFoundException("Quiz non trouvé");
    }

    return this.apiResponse.success(quiz);
  }

  @Post()
  async create(@Body() data: any) {
    if (!data.titre) {
      throw new BadRequestException("titre est obligatoire");
    }

    const quiz = this.quizRepository.create(data);
    const saved = await this.quizRepository.save(quiz);

    return this.apiResponse.success(saved);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data: any) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException("Quiz non trouvé");
    }

    await this.quizRepository.update(id, data);
    const updated = await this.quizRepository.findOne({
      where: { id },
      relations: ["questions", "questions.reponses", "formations"],
    });

    return this.apiResponse.success(updated);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException("Quiz non trouvé");
    }

    await this.quizRepository.delete(id);

    return this.apiResponse.success();
  }

  @Post(":id/duplicate")
  async duplicate(@Param("id") id: number) {
    const original = await this.quizRepository.findOne({
      where: { id },
      relations: ["questions", "questions.reponses"],
    });

    if (!original) {
      throw new NotFoundException("Quiz non trouvé");
    }

    const newQuiz = this.quizRepository.create({
      ...original,
      titre: `${original.titre} (Copie)`,
      id: undefined,
    });

    const saved = await this.quizRepository.save(newQuiz);

    return this.apiResponse.success(saved);
  }

  @Patch(":id/enable")
  async enable(@Param("id") id: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException("Quiz non trouvé");
    }

    await this.quizRepository.update(id, { status: "actif" });
    const updated = await this.quizRepository.findOne({
      where: { id },
      relations: ["questions", "questions.reponses", "formations"],
    });

    return this.apiResponse.success(updated);
  }

  @Patch(":id/disable")
  async disable(@Param("id") id: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException("Quiz non trouvé");
    }

    await this.quizRepository.update(id, { status: "inactif" });
    const updated = await this.quizRepository.findOne({
      where: { id },
      relations: ["questions", "questions.reponses", "formations"],
    });

    return this.apiResponse.success(updated);
  }
}
