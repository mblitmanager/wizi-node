import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RankingService } from "./ranking.service";
import { RankingController } from "./ranking.controller";
import { ClassementsApiController } from "./classements-api.controller";
import { Classement } from "../entities/classement.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { Progression } from "../entities/progression.entity";
import { Quiz } from "../entities/quiz.entity";
import { User } from "../entities/user.entity";
import { Formation } from "../entities/formation.entity";
import { Question } from "../entities/question.entity";
import { Reponse } from "../entities/reponse.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Classement,
      Stagiaire,
      QuizParticipation,
      Progression,
      Quiz,
      User,
      Formation,
      Question,
      Reponse,
    ]),
  ],
  providers: [RankingService],
  controllers: [RankingController, ClassementsApiController],
  exports: [RankingService],
})
export class RankingModule {}
