import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Quiz } from "../entities/quiz.entity";
import { Question } from "../entities/question.entity";
import { Reponse } from "../entities/reponse.entity";
import { Formation } from "../entities/formation.entity";
import { Classement } from "../entities/classement.entity";
import { QuizService } from "./quiz.service";
import { QuizController } from "./quiz.controller";
import {
  QuizApiController,
  FormationApiController,
  FormationsApiController,
  CatalogueFormationsApiController,
  FormationParrainageApiController,
  MediasApiController,
  MediaApiController,
} from "./quiz-api.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Question, Reponse, Formation, Classement]),
  ],
  controllers: [
    QuizController,
    QuizApiController,
    FormationApiController,
    FormationsApiController,
    CatalogueFormationsApiController,
    FormationParrainageApiController,
    MediasApiController,
    MediaApiController,
  ],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
