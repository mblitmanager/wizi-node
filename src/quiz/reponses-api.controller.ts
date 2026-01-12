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
import { QuizService } from "./quiz.service";
import { Reponse } from "../entities/reponse.entity";
import { Question } from "../entities/question.entity";

@Controller("reponses")
@UseGuards(AuthGuard("jwt"))
export class ReponseApiController {
  constructor(
    private quizService: QuizService,
    private apiResponse: ApiResponseService,
    @InjectRepository(Reponse)
    private reponseRepository: Repository<Reponse>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>
  ) {}

  /**
   * GET /api/reponses
   * Récupérer toutes les réponses en format JSON-LD (collection)
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

    const [data, total] = await this.reponseRepository.findAndCount({
      skip,
      take: limitNum,
      relations: ["question"],
      order: { id: "DESC" },
    });

    const members = data.map((r) => this.quizService.formatReponseJsonLd(r));

    return {
      "@context": "/api/contexts/Reponse",
      "@id": "/api/reponses",
      "@type": "Collection",
      "hydra:member": members,
      "hydra:totalItems": total,
      "hydra:view": {
        "@id": `/api/reponses?page=${pageNum}&limit=${limitNum}`,
        "@type": "PartialCollectionView",
        "hydra:first": `/api/reponses?page=1&limit=${limitNum}`,
        "hydra:last": `/api/reponses?page=${Math.ceil(total / limitNum)}&limit=${limitNum}`,
        "hydra:next":
          pageNum < Math.ceil(total / limitNum)
            ? `/api/reponses?page=${pageNum + 1}&limit=${limitNum}`
            : null,
      },
    };
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
      isCorrect:
        createReponseDto.correct || createReponseDto.is_correct || false,
      position: createReponseDto.position || createReponseDto.ordre,
      flashcardBack:
        createReponseDto.flashcard_back || createReponseDto.explanation,
      question_id: createReponseDto.question_id,
      match_pair: createReponseDto.match_pair,
      bank_group: createReponseDto.bank_group,
    });

    const saved = await this.reponseRepository.save(reponse);
    const result = await this.reponseRepository.findOne({
      where: { id: saved.id },
      relations: ["question"],
    });

    return this.quizService.formatReponseJsonLd(result);
  }

  /**
   * GET /api/reponses/{id}
   * Récupérer les détails d'une réponse en JSON-LD
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

    return this.quizService.formatReponseJsonLd(reponse);
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
      isCorrect:
        updateReponseDto.correct ??
        updateReponseDto.is_correct ??
        reponse.isCorrect,
      position:
        updateReponseDto.position ?? updateReponseDto.ordre ?? reponse.position,
      flashcardBack:
        updateReponseDto.flashcard_back ??
        updateReponseDto.explanation ??
        reponse.flashcardBack,
      match_pair: updateReponseDto.match_pair ?? reponse.match_pair,
      bank_group: updateReponseDto.bank_group ?? reponse.bank_group,
    });

    await this.reponseRepository.save(reponse);
    const updated = await this.reponseRepository.findOne({
      where: { id },
      relations: ["question"],
    });

    return this.quizService.formatReponseJsonLd(updated);
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

    return { id, message: "Réponse supprimée avec succès" };
  }
}
