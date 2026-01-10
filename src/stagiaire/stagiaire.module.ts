import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "../common/common.module";
import { ApiResponseService } from "../common/services/api-response.service";
import { Stagiaire } from "../entities/stagiaire.entity";
import { StagiaireService } from "./stagiaire.service";
import { StagiaireController } from "./stagiaire.controller";
import { StagiairesController } from "./stagiaires.controller";
import { StagiaireApiController, ApiGeneralController } from "./stagiaire-api.controller";
import { Classement } from "../entities/classement.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Quiz } from "../entities/quiz.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { Formation } from "../entities/formation.entity";
import { InscriptionModule } from "../inscription/inscription.module";
import { RankingModule } from "../ranking/ranking.module";

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([
      Stagiaire,
      Classement,
      CatalogueFormation,
      Formation,
      Quiz,
      QuizParticipation,
    ]),
    InscriptionModule,
    RankingModule,
  ],
  providers: [StagiaireService, ApiResponseService],
  controllers: [StagiaireController, StagiairesController, StagiaireApiController, ApiGeneralController],
  exports: [StagiaireService],
})
export class StagiaireModule {}
