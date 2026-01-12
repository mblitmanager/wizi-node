import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChallengeService } from "./challenge.service";
import { ChallengeController } from "./challenge.controller";
import { Challenge } from "../entities/challenge.entity";
import { Progression } from "../entities/progression.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Challenge,
      Progression,
      Stagiaire,
      QuizParticipation,
    ]),
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
