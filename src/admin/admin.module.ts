import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailModule } from "../mail/mail.module";
import { NotificationModule } from "../notification/notification.module";
import { CommonModule } from "../common/common.module";
import { ApiResponseService } from "../common/services/api-response.service";
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
import { AdminDataResetController } from "./admin-data-reset.controller";
// New imports
import { AdminDemandeHistoriqueController } from "./admin-demande-historique.controller";
import { AdminParrainageEventController } from "./admin-parrainage-event.controller";
import { AdminCatalogueFormationController } from "./admin-catalogue-formation.controller";
import { AdminCommercialController } from "./admin-commercial.controller";
import { AdminPoleRelationClientController } from "./admin-prc.controller";
import {
  AdminPermissionController,
  AdminRoleController,
} from "./admin-permission-role.controller";
import {
  AdminParametreController,
  AdminClassementController,
  AdminParrainageController,
  AdminPartenaireController,
  AdminMediasController,
} from "./admin-misc.controller";
import {
  AdminStatsController,
  AdminImportController,
  AdminInactivityController,
} from "./admin-stats-import.controller";
import {
  FormateurWebController,
  CommercialWebController,
} from "./formateur-commercial-web.controller";
import {
  FormateurApiController,
  CommercialApiController,
} from "./formateur-commercial-api.controller";
import { FormateurFormationController } from "./formateur-formation.controller";
import { FormateurQuizController } from "./formateur-quiz.controller";
import { FormateurAlertsController } from "./formateur-alerts.controller";
// Import entities
import { Stagiaire } from "../entities/stagiaire.entity";
import { User } from "../entities/user.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { QuizParticipationAnswer } from "../entities/quiz-participation-answer.entity";
import { Formateur } from "../entities/formateur.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Quiz } from "../entities/quiz.entity";
import { Achievement } from "../entities/achievement.entity";
import { Setting } from "../entities/setting.entity";
import { Media } from "../entities/media.entity";
import { Question } from "../entities/question.entity";
import { Formation } from "../entities/formation.entity";
import { Commercial } from "../entities/commercial.entity";
import { PoleRelationClient } from "../entities/pole-relation-client.entity";
import { StagiaireCatalogueFormation } from "../entities/stagiaire-catalogue-formation.entity";
import { Partenaire } from "../entities/partenaire.entity";
import { DemandeInscription } from "../entities/demande-inscription.entity";
import { ParrainageEvent } from "../entities/parrainage-event.entity";
import { Classement } from "../entities/classement.entity";
import { Progression } from "../entities/progression.entity";
import { StagiaireAchievement } from "../entities/stagiaire-achievement.entity";
import { Reponse } from "../entities/reponse.entity";

@Module({
  imports: [
    MailModule,
    NotificationModule,
    CommonModule,
    TypeOrmModule.forFeature([
      Stagiaire,
      User,
      QuizParticipation,
      QuizParticipationAnswer,
      Formateur,
      CatalogueFormation,
      Quiz,
      Achievement,
      Setting,
      Media,
      Question,
      Formation,
      Commercial,
      PoleRelationClient,
      StagiaireCatalogueFormation,
      Partenaire,
      DemandeInscription,
      ParrainageEvent,
      Classement,
      Progression,
      StagiaireAchievement,
      Reponse,
    ]),
  ],
  providers: [AdminService, ApiResponseService],
  controllers: [
    // Existing
    AdminController,
    AdminDashboardController,
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
    AdminDataResetController,
    // New Admin Controllers
    AdminCatalogueFormationController,
    AdminCommercialController,
    AdminPoleRelationClientController,
    AdminPermissionController,
    AdminRoleController,
    AdminParametreController,
    AdminClassementController,
    AdminParrainageController,
    AdminPartenaireController,
    AdminMediasController,
    AdminStatsController,
    AdminImportController,
    AdminInactivityController,
    AdminDemandeHistoriqueController,
    AdminParrainageEventController,
    // Web Controllers
    FormateurWebController,
    CommercialWebController,
    // API Controllers
    FormateurApiController,
    CommercialApiController,
    // Formateur Specific Controllers
    FormateurFormationController,
    FormateurQuizController,
    FormateurAlertsController,
  ],
  exports: [AdminService],
})
export class AdminModule {}
