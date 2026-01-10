import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { AdminDashboardController } from "./admin-dashboard.controller";
import { FormateurController } from "./formateur.controller";
import { CommercialController } from "./commercial.controller";
import { AdminStagiaireController } from "./admin-stagiaire.controller";
import { AdminFormateurController } from "./admin-formateur.controller";
import { AdminQuizController } from "./admin-quiz.controller";
import { AdminFormationController } from "./admin-formation.controller";
import { AdminCatalogueController } from "./admin-catalogue.controller";
import { AdminAchievementController } from "./admin-achievement.controller";
import { AdminSettingsController } from "./admin-settings.controller";
import { AdminMediaController } from "./admin-media.controller";
import { AdminQuestionController } from "./admin-question.controller";
import { Stagiaire } from "../entities/stagiaire.entity";
import { User } from "../entities/user.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { Formateur } from "../entities/formateur.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Quiz } from "../entities/quiz.entity";
import { Achievement } from "../entities/achievement.entity";
import { Setting } from "../entities/setting.entity";
import { Media } from "../entities/media.entity";
import { Question } from "../entities/question.entity";
import { Formation } from "../entities/formation.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stagiaire,
      User,
      QuizParticipation,
      Formateur,
      CatalogueFormation,
      Quiz,
      Achievement,
      Setting,
      Media,
      Question,
      Formation,
    ]),
  ],
  providers: [AdminService],
  controllers: [
    AdminController,
    AdminDashboardController,
    FormateurController,
    CommercialController,
    AdminStagiaireController,
    AdminFormateurController,
    AdminQuizController,
    AdminFormationController,
    AdminCatalogueController,
    AdminAchievementController,
    AdminSettingsController,
    AdminMediaController,
    AdminQuestionController,
  ],
  exports: [AdminService],
})
export class AdminModule {}
