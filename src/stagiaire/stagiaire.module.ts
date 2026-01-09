import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { StagiaireService } from "./stagiaire.service";
import { StagiaireController } from "./stagiaire.controller";
import { StagiairesController } from "./stagiaires.controller";
import { Classement } from "../entities/classement.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Formation } from "../entities/formation.entity";
import { InscriptionModule } from "../inscription/inscription.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stagiaire,
      Classement,
      CatalogueFormation,
      Formation,
    ]),
    InscriptionModule,
  ],
  providers: [StagiaireService],
  controllers: [StagiaireController, StagiairesController],
  exports: [StagiaireService],
})
export class StagiaireModule {}
