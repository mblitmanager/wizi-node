import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AchievementService } from "./achievement.service";
import { AchievementController } from "./achievement.controller";
import { Achievement } from "../entities/achievement.entity";
import { Stagiaire } from "../entities/stagiaire.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Achievement, Stagiaire])],
  providers: [AchievementService],
  controllers: [AchievementController],
  exports: [AchievementService],
})
export class AchievementModule {}
