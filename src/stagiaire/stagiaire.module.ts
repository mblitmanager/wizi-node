import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { StagiaireService } from "./stagiaire.service";
import { StagiaireController } from "./stagiaire.controller";
import { Classement } from "../entities/classement.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Formation } from "../entities/formation.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stagiaire,
      Classement,
      CatalogueFormation,
      Formation,
    ]),
  ],
  providers: [StagiaireService],
  controllers: [StagiaireController],
  exports: [StagiaireService],
})
export class StagiaireModule {}
