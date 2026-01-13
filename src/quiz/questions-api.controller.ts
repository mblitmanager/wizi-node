import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiResponseService } from "../common/services/api-response.service";
import { QuizService } from "./quiz.service";
import { Question } from "../entities/question.entity";
import { Reponse } from "../entities/reponse.entity";

@Controller("questions")
// @UseGuards(AuthGuard("jwt"))
export class QuestionsApiController {
  constructor(
    private quizService: QuizService,
    private apiResponse: ApiResponseService,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Reponse)
    private reponseRepository: Repository<Reponse>
  ) {}

  /**
   * GET /api/questions
   * Récupérer toutes les questions en format JSON-LD (collection)
   */
  @Get()
  async getAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 30
  ) {
    const pageNum = typeof page === "string" ? parseInt(page, 10) : page || 1;
    const limitNum =
      typeof limit === "string" ? parseInt(limit, 10) : limit || 30;
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await this.questionRepository.findAndCount({
      skip,
      take: limitNum,
      relations: ["reponses", "quiz"],
      order: { id: "DESC" },
    });

    const members = data.map((q) => this.quizService.formatQuestionJsonLd(q));

    return {
      "@context": "/api/contexts/Questions",
      "@id": "/api/questions",
      "@type": "Collection",
      totalItems: total,
      member: members,
    };
  }

  /**
   * POST /api/questions
   * Créer une nouvelle question
   */
  @Post()
  async create(@Body() createQuestionDto: any) {
    const question = this.questionRepository.create({
      text: createQuestionDto.texte || createQuestionDto.text,
      quiz_id: createQuestionDto.quiz_id,
      type: createQuestionDto.type || "choix multiples",
      points: createQuestionDto.points || "1",
      astuce: createQuestionDto.astuce || createQuestionDto.hint,
      explication:
        createQuestionDto.explication || createQuestionDto.explanation,
      audio_url: createQuestionDto.audio_url,
      media_url: createQuestionDto.media_url || createQuestionDto.image_url,
    });

    const saved = await this.questionRepository.save(question);
    const result = await this.questionRepository.findOne({
      where: { id: saved.id },
      relations: ["reponses", "quiz"],
    });

    return this.quizService.formatQuestionJsonLd(result);
  }

  /**
   * GET /api/questions/{id}
   * Récupérer les détails d'une question en JSON-LD
   */
  @Get(":id")
  async getById(@Param("id") id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ["reponses", "quiz"],
    });

    if (!question) {
      throw new NotFoundException("Question non trouvée");
    }

    return this.quizService.formatQuestionJsonLd(question);
  }

  /**
   * PATCH /api/questions/{id}
   * Modifier une question
   */
  @Patch(":id")
  async update(@Param("id") id: number, @Body() updateQuestionDto: any) {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ["reponses", "quiz"],
    });

    if (!question) {
      throw new NotFoundException("Question non trouvée");
    }

    Object.assign(question, {
      text: updateQuestionDto.texte ?? updateQuestionDto.text ?? question.text,
      type: updateQuestionDto.type ?? question.type,
      points: updateQuestionDto.points ?? question.points,
      astuce:
        updateQuestionDto.astuce ?? updateQuestionDto.hint ?? question.astuce,
      explication:
        updateQuestionDto.explication ??
        updateQuestionDto.explanation ??
        question.explication,
      audio_url: updateQuestionDto.audio_url ?? question.audio_url,
      media_url:
        updateQuestionDto.media_url ??
        updateQuestionDto.image_url ??
        question.media_url,
    });

    await this.questionRepository.save(question);
    const updated = await this.questionRepository.findOne({
      where: { id },
      relations: ["reponses", "quiz"],
    });

    return this.quizService.formatQuestionJsonLd(updated);
  }

  /**
   * DELETE /api/questions/{id}
   * Supprimer une question
   */
  @Delete(":id")
  async delete(@Param("id") id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException("Question non trouvée");
    }

    await this.questionRepository.remove(question);

    return { id, message: "Question supprimée avec succès" };
  }

  /**
   * GET /api/questions/{questionId}/reponses
   * Récupérer les réponses d'une question
   */
  @Get(":questionId/reponses")
  async getReponsesByQuestion(@Param("questionId") questionId: number) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ["reponses"],
    });

    if (!question) {
      throw new NotFoundException("Question non trouvée");
    }

    return question.reponses.map((r) =>
      this.quizService.formatReponseJsonLd(r)
    );
  }
}
