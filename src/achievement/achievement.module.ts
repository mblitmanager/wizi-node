import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AchievementService } from "./achievement.service";
import { AchievementController } from "./achievement.controller";
import { Achievement } from "../entities/achievement.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { StagiaireAchievement } from "../entities/stagiaire-achievement.entity";
import { Progression } from "../entities/progression.entity";
import { Quiz } from "../entities/quiz.entity";
import { MediaStagiaire } from "../entities/media-stagiaire.entity";
import { Media } from "../entities/media.entity";
import { Parrainage } from "../entities/parrainage.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      Stagiaire,
      StagiaireAchievement,
      Progression,
      Quiz,
      MediaStagiaire,
      Media,
      Parrainage,
    ]),
  ],
  providers: [AchievementService],
  controllers: [AchievementController],
  exports: [AchievementService],
})
export class AchievementModule {}
