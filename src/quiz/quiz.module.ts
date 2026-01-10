import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "../common/common.module";
import { ApiResponseService } from "../common/services/api-response.service";
import { Quiz } from "../entities/quiz.entity";
import { Question } from "../entities/question.entity";
import { Reponse } from "../entities/reponse.entity";
import { Formation } from "../entities/formation.entity";
import { Classement } from "../entities/classement.entity";
import { QuizService } from "./quiz.service";
import { QuizApiController } from "./quiz-api.controller";
import { RankingModule } from "../ranking/ranking.module";

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Quiz, Question, Reponse, Formation, Classement]),
    RankingModule,
  ],
  controllers: [QuizApiController],
  providers: [QuizService, ApiResponseService],
  exports: [QuizService],
})
export class QuizModule {}
