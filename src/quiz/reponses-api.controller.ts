import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiResponseService } from "../common/services/api-response.service";
import { Reponse } from "../entities/reponse.entity";
import { Question } from "../entities/question.entity";

@Controller("reponses")
@UseGuards(AuthGuard("jwt"))
export class ReponseApiController {
  constructor(
    private apiResponse: ApiResponseService,
    @InjectRepository(Reponse)
    private reponseRepository: Repository<Reponse>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>
  ) {}

  /**
   * GET /api/reponses
   * Récupérer toutes les réponses avec pagination optionnelle
   */
  @Get()
  async getAll(@Query("page") page: number = 1, @Query("limit") limit: number = 30) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.reponseRepository.findAndCount({
      skip,
      take: limit,
      relations: ["question"],
      order: { id: "DESC" },
    });

    return this.apiResponse.success({
      data: data.map(r => this.formatReponse(r)),
      pagination: {
        current_page: page,
        per_page: limit,
        total,
        last_page: Math.ceil(total / limit),
      },
    });
  }

  /**
   * POST /api/reponses
   * Créer une nouvelle réponse
   */
  @Post()
  async create(@Body() createReponseDto: any) {
    // Vérifier que la question existe
    const question = await this.questionRepository.findOne({
      where: { id: createReponseDto.question_id },
    });

    if (!question) {
      throw new NotFoundException("Question non trouvée");
    }

    const reponse = this.reponseRepository.create({
      text: createReponseDto.texte || createReponseDto.text,
      isCorrect: createReponseDto.correct || createReponseDto.is_correct || false,
      position: createReponseDto.position || createReponseDto.ordre,
      flashcardBack: createReponseDto.flashcard_back || createReponseDto.explanation,
      question_id: createReponseDto.question_id,
      match_pair: createReponseDto.match_pair,
      bank_group: createReponseDto.bank_group,
    });

    const saved = await this.reponseRepository.save(reponse);
    const result = await this.reponseRepository.findOne({
      where: { id: saved.id },
      relations: ["question"],
    });

    return this.apiResponse.success(
      this.formatReponse(result),
      "Réponse créée avec succès",
      201
    );
  }

  /**
   * GET /api/reponses/{id}
   * Récupérer les détails d'une réponse
   */
  @Get(":id")
  async getById(@Param("id") id: number) {
    const reponse = await this.reponseRepository.findOne({
      where: { id },
      relations: ["question"],
    });

    if (!reponse) {
      throw new NotFoundException("Réponse non trouvée");
    }

    return this.apiResponse.success(this.formatReponse(reponse));
  }

  /**
   * PATCH /api/reponses/{id}
   * Modifier une réponse
   */
  @Patch(":id")
  async update(@Param("id") id: number, @Body() updateReponseDto: any) {
    const reponse = await this.reponseRepository.findOne({
      where: { id },
      relations: ["question"],
    });

    if (!reponse) {
      throw new NotFoundException("Réponse non trouvée");
    }

    Object.assign(reponse, {
      text: updateReponseDto.texte ?? updateReponseDto.text ?? reponse.text,
      isCorrect: updateReponseDto.correct ?? updateReponseDto.is_correct ?? reponse.isCorrect,
      position: updateReponseDto.position ?? updateReponseDto.ordre ?? reponse.position,
      flashcardBack: updateReponseDto.flashcard_back ?? updateReponseDto.explanation ?? reponse.flashcardBack,
      match_pair: updateReponseDto.match_pair ?? reponse.match_pair,
      bank_group: updateReponseDto.bank_group ?? reponse.bank_group,
    });

    await this.reponseRepository.save(reponse);
    const updated = await this.reponseRepository.findOne({
      where: { id },
      relations: ["question"],
    });

    return this.apiResponse.success(
      this.formatReponse(updated),
      "Réponse mise à jour"
    );
  }

  /**
   * DELETE /api/reponses/{id}
   * Supprimer une réponse
   */
  @Delete(":id")
  async delete(@Param("id") id: number) {
    const reponse = await this.reponseRepository.findOne({
      where: { id },
    });

    if (!reponse) {
      throw new NotFoundException("Réponse non trouvée");
    }

    await this.reponseRepository.remove(reponse);

    return this.apiResponse.success(
      { id },
      "Réponse supprimée avec succès"
    );
  }

  /**
   * Formatter une réponse au format ApiPlatform JSON-LD
   */
  private formatReponse(reponse: Reponse) {
    return {
      "@context": "/api/contexts/Reponse",
      "@id": `/api/reponses/${reponse.id}`,
      "@type": "Reponse",
      id: reponse.id,
      texte: reponse.text,
      correct: reponse.isCorrect || false,
      position: reponse.position,
      explanation: reponse.flashcardBack,
      match_pair: reponse.match_pair,
      bank_group: reponse.bank_group,
      question: reponse.question ? `/api/questions/${reponse.question.id}` : null,
      created_at: reponse.created_at,
      updated_at: reponse.updated_at,
    };
  }
}
