import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { FormateurController } from "./formateur.controller";
import { CommercialController } from "./commercial.controller";
import { AdminStagiaireController } from "./admin-stagiaire.controller";
import { AdminFormateurController } from "./admin-formateur.controller";
import { AdminQuizController } from "./admin-quiz.controller";
import { AdminFormationController } from "./admin-formation.controller";
import { Stagiaire } from "../entities/stagiaire.entity";
import { User } from "../entities/user.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { Formateur } from "../entities/formateur.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Quiz } from "../entities/quiz.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stagiaire,
      User,
      QuizParticipation,
      Formateur,
      CatalogueFormation,
      Quiz,
    ]),
  ],
  providers: [AdminService],
  controllers: [
    AdminController,
    FormateurController,
    CommercialController,
    AdminStagiaireController,
    AdminFormateurController,
    AdminQuizController,
    AdminFormationController,
  ],
  exports: [AdminService],
})
export class AdminModule {}
