import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Request,
  Query,
  Patch,
  Delete,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiResponseService } from "../common/services/api-response.service";
import { QuizService } from "./quiz.service";
import { Quiz } from "../entities/quiz.entity";

@Controller("quizzes")
@UseGuards(AuthGuard("jwt"))
export class QuizzesApiController {
  constructor(
    private quizService: QuizService,
    private apiResponse: ApiResponseService,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>
  ) {}

  /**
   * GET /api/quizzes
   * Récupérer tous les quizzes en format JSON-LD (collection)
   */
  @Get()
  async getAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 30
  ) {
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page || 1;
    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit || 30;
    const skip = (pageNum - 1) * limitNum;

    const [quizzes, total] = await this.quizRepository.findAndCount({
      skip,
      take: limitNum,
      relations: ["formation", "questions"],
      order: { id: "DESC" },
    });

    const data = quizzes.map((q) => this.quizService.formatQuizJsonLd(q));

    return {
      "@context": "/api/contexts/Quiz",
      "@id": "/api/quizzes",
      "@type": "Collection",
      "hydra:member": data,
      "hydra:totalItems": total,
      "hydra:view": {
        "@id": `/api/quizzes?page=${pageNum}&limit=${limitNum}`,
        "@type": "PartialCollectionView",
        "hydra:first": `/api/quizzes?page=1&limit=${limitNum}`,
        "hydra:last": `/api/quizzes?page=${Math.ceil(total / limitNum)}&limit=${limitNum}`,
        "hydra:next":
          pageNum < Math.ceil(total / limitNum)
            ? `/api/quizzes?page=${pageNum + 1}&limit=${limitNum}`
            : null,
      },
    };
  }

  /**
   * POST /api/quizzes
   * Créer un nouveau quiz
   */
  @Post()
  async create(@Body() createQuizDto: any) {
    const quiz = this.quizRepository.create({
      titre: createQuizDto.titre,
      description: createQuizDto.description,
      formation_id: createQuizDto.formation_id,
      status: createQuizDto.status || "actif",
      nb_points_total: createQuizDto.nb_points_total || 0,
    });

    const saved = await this.quizRepository.save(quiz);
    const result = await this.quizRepository.findOne({
      where: { id: saved.id },
      relations: ["formation", "questions"],
    });

    return this.quizService.formatQuizJsonLd(result);
  }

  /**
   * GET /api/quizzes/{id}
   * Récupérer un quiz en format JSON-LD
   */
  @Get(":id")
  async getById(@Param("id") id: number) {
    // Note: Returning raw JSON-LD object without success() wrapper for ApiPlatform compatibility
    return this.quizService.getQuizJsonLd(id);
  }

  /**
   * PATCH /api/quizzes/{id}
   * Modifier un quiz
   */
  @Patch(":id")
  async update(@Param("id") id: number, @Body() updateQuizDto: any) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ["formation", "questions"],
    });

    if (!quiz) {
      throw new NotFoundException("Quiz non trouvé");
    }

    Object.assign(quiz, {
      titre: updateQuizDto.titre ?? quiz.titre,
      description: updateQuizDto.description ?? quiz.description,
      status: updateQuizDto.status ?? quiz.status,
      nb_points_total: updateQuizDto.nb_points_total ?? quiz.nb_points_total,
    });

    await this.quizRepository.save(quiz);
    const updated = await this.quizRepository.findOne({
      where: { id },
      relations: ["formation", "questions"],
    });

    return this.quizService.formatQuizJsonLd(updated);
  }

  /**
   * DELETE /api/quizzes/{id}
   * Supprimer un quiz
   */
  @Delete(":id")
  async delete(@Param("id") id: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException("Quiz non trouvé");
    }

    await this.quizRepository.remove(quiz);

    return { id, message: "Quiz supprimé avec succès" };
  }

  /**
   * POST /api/quizzes/{quizId}/submit
   * Soumettre les réponses d'un quiz
   */
  @Post(":quizId/submit")
  async submit(
    @Param("quizId") quizId: number,
    @Body() data: any,
    @Request() req: any
  ) {
    return {
      quiz_id: quizId,
      score: 0,
      message: "Quiz soumis",
    };
  }
}
