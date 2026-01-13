import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "../common/common.module";
import { ApiResponseService } from "../common/services/api-response.service";
import { Quiz } from "../entities/quiz.entity";
import { Question } from "../entities/question.entity";
import { Reponse } from "../entities/reponse.entity";
import { Formation } from "../entities/formation.entity";
import { Classement } from "../entities/classement.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { QuizParticipationAnswer } from "../entities/quiz-participation-answer.entity";
import { CorrespondancePair } from "../entities/correspondance-pair.entity";
import { QuizService } from "./quiz.service";
import { QuizApiController } from "./quiz-api.controller";
import { QuizzesApiController } from "./quizzes-api.controller";
import { QuestionsApiController } from "./questions-api.controller";
import { ReponseApiController } from "./reponses-api.controller";
import { RankingModule } from "../ranking/ranking.module";
import { AchievementModule } from "../achievement/achievement.module";
import { Progression } from "../entities/progression.entity";
import { User } from "../entities/user.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { StagiaireCatalogueFormation } from "../entities/stagiaire-catalogue-formation.entity";

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([
      Quiz,
      Question,
      Reponse,
      Formation,
      Classement,
      Classement,
      QuizParticipation,
      QuizParticipationAnswer,
      CorrespondancePair,
      Progression,
      User,
      Stagiaire,
      StagiaireCatalogueFormation,
    ]),
    RankingModule,
    AchievementModule,
  ],
  controllers: [
    QuizApiController,
    QuizzesApiController,
    QuestionsApiController,
    ReponseApiController,
  ],
  providers: [QuizService, ApiResponseService],
  exports: [QuizService],
})
export class QuizModule {}
