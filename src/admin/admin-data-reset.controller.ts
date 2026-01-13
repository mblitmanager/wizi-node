import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Classement } from "../entities/classement.entity";
import { Progression } from "../entities/progression.entity";
import { StagiaireAchievement } from "../entities/stagiaire-achievement.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { QuizParticipationAnswer } from "../entities/quiz-participation-answer.entity";
import { ApiResponseService } from "../common/services/api-response.service";

interface ResetDataDto {
  dataTypes: string[];
  confirmation: boolean;
}

@Controller("admin/data")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminDataResetController {
  constructor(
    @InjectRepository(Classement)
    private classementRepository: Repository<Classement>,
    @InjectRepository(Progression)
    private progressionRepository: Repository<Progression>,
    @InjectRepository(StagiaireAchievement)
    private achievementRepository: Repository<StagiaireAchievement>,
    @InjectRepository(QuizParticipation)
    private participationRepository: Repository<QuizParticipation>,
    @InjectRepository(QuizParticipationAnswer)
    private answerRepository: Repository<QuizParticipationAnswer>,
    private apiResponse: ApiResponseService
  ) {}

  @Post("reset")
  async resetData(@Body() dto: ResetDataDto) {
    if (!dto.confirmation) {
      throw new HttpException(
        "Confirmation requise pour cette action critique",
        HttpStatus.BAD_REQUEST
      );
    }

    if (!dto.dataTypes || dto.dataTypes.length === 0) {
      throw new HttpException(
        "Veuillez sélectionner au moins un type de données à réinitialiser",
        HttpStatus.BAD_REQUEST
      );
    }

    const results: Record<string, number> = {};

    for (const dataType of dto.dataTypes) {
      switch (dataType) {
        case "classements":
          const classementResult = await this.classementRepository.delete({});
          results.classements = classementResult.affected || 0;
          break;

        case "progressions":
          const progressionResult = await this.progressionRepository.delete({});
          results.progressions = progressionResult.affected || 0;
          break;

        case "achievements":
          const achievementResult = await this.achievementRepository.delete({});
          results.achievements = achievementResult.affected || 0;
          break;

        case "quiz_participations":
          // First delete answers (child records)
          const answersFirst = await this.answerRepository.delete({});
          results.quiz_answers_cascade = answersFirst.affected || 0;
          // Then delete participations
          const participationResult = await this.participationRepository.delete(
            {}
          );
          results.quiz_participations = participationResult.affected || 0;
          break;

        case "quiz_answers":
          const answerResult = await this.answerRepository.delete({});
          results.quiz_answers = answerResult.affected || 0;
          break;

        case "quiz_history":
          // Delete progressions that are quiz-related
          const historyResult = await this.progressionRepository
            .createQueryBuilder()
            .delete()
            .where("quiz_id IS NOT NULL")
            .execute();
          results.quiz_history = historyResult.affected || 0;
          break;

        default:
          // Unknown data type, skip
          break;
      }
    }

    return this.apiResponse.success({
      message: "Données réinitialisées avec succès",
      deleted: results,
    });
  }
}
