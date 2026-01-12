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
import { RankingModule } from "../ranking/ranking.module";

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
    ]),
    RankingModule,
  ],
  controllers: [QuizApiController, QuizzesApiController],
  providers: [QuizService, ApiResponseService],
  exports: [QuizService],
})
export class QuizModule {}
