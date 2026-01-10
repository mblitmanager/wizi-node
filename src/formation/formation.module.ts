import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Formation } from "../entities/formation.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { StagiaireCatalogueFormation } from "../entities/stagiaire-catalogue-formation.entity";
import { FormationService } from "./formation.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Formation,
      CatalogueFormation,
      StagiaireCatalogueFormation,
    ]),
  ],
  controllers: [],
  providers: [FormationService],
  exports: [FormationService],
})
export class FormationModule {}
