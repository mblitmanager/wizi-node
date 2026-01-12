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
import { Question } from "../entities/question.entity";
import { Reponse } from "../entities/reponse.entity";

@Controller("questions")
@UseGuards(AuthGuard("jwt"))
export class QuestionsApiController {
  constructor(
    private apiResponse: ApiResponseService,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Reponse)
    private reponseRepository: Repository<Reponse>
  ) {}

  /**
   * GET /api/questions
   * Récupérer toutes les questions avec pagination optionnelle
   */
  @Get()
  async getAll(@Query("page") page: number = 1, @Query("limit") limit: number = 30) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await this.questionRepository.findAndCount({
      skip,
      take: limit,
      relations: ["reponses", "quiz"],
      order: { id: "DESC" },
    });

    return this.apiResponse.success({
      data: data.map(q => this.formatQuestion(q)),
      pagination: {
        current_page: page,
        per_page: limit,
        total,
        last_page: Math.ceil(total / limit),
      },
    });
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
      explication: createQuestionDto.explication || createQuestionDto.explanation,
      audio_url: createQuestionDto.audio_url,
      media_url: createQuestionDto.media_url || createQuestionDto.image_url,
    });

    const saved = await this.questionRepository.save(question);
    const result = await this.questionRepository.findOne({
      where: { id: saved.id },
      relations: ["reponses", "quiz"],
    });

    return this.apiResponse.success(
      this.formatQuestion(result),
      "Question créée avec succès",
      201
    );
  }

  /**
   * GET /api/questions/{id}
   * Récupérer les détails d'une question
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

    return this.apiResponse.success(this.formatQuestion(question));
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
      astuce: updateQuestionDto.astuce ?? updateQuestionDto.hint ?? question.astuce,
      explication: updateQuestionDto.explication ?? updateQuestionDto.explanation ?? question.explication,
      audio_url: updateQuestionDto.audio_url ?? question.audio_url,
      media_url: updateQuestionDto.media_url ?? updateQuestionDto.image_url ?? question.media_url,
    });

    await this.questionRepository.save(question);
    const updated = await this.questionRepository.findOne({
      where: { id },
      relations: ["reponses", "quiz"],
    });

    return this.apiResponse.success(
      this.formatQuestion(updated),
      "Question mise à jour"
    );
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

    return this.apiResponse.success(
      { id },
      "Question supprimée avec succès"
    );
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

    return this.apiResponse.success(
      question.reponses.map(r => this.formatReponse(r))
    );
  }

  /**
   * Formatter une question au format ApiPlatform JSON-LD
   */
  private formatQuestion(question: Question) {
    return {
      "@context": "/api/contexts/Question",
      "@id": `/api/questions/${question.id}`,
      "@type": "Question",
      id: question.id,
      texte: question.text,
      type: question.type || "choix multiples",
      points: question.points || "1",
      astuce: question.astuce,
      explication: question.explication,
      audio_url: question.audio_url,
      media_url: question.media_url,
      flashcard_back: question.flashcard_back,
      quiz: question.quiz ? `/api/quizzes/${question.quiz.id}` : null,
      reponses: question.reponses
        ? question.reponses.map(r => `/api/reponses/${r.id}`)
        : [],
      created_at: question.created_at,
      updated_at: question.updated_at,
    };
  }

  /**
   * Formatter une réponse
   */
  private formatReponse(reponse: Reponse) {
    return {
      "@id": `/api/reponses/${reponse.id}`,
      id: reponse.id,
      texte: reponse.text,
      correct: reponse.isCorrect || false,
      position: reponse.position,
      explanation: reponse.flashcardBack,
      question: `/api/questions/${reponse.question_id}`,
      created_at: reponse.created_at,
    };
  }
}
