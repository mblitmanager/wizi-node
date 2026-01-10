import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Formation } from "../entities/formation.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { StagiaireCatalogueFormation } from "../entities/stagiaire-catalogue-formation.entity";
import { FormationService } from "./formation.service";
import { FormationController } from "./formation.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Formation,
      CatalogueFormation,
      StagiaireCatalogueFormation,
    ]),
  ],
  controllers: [FormationController],
  providers: [FormationService],
  exports: [FormationService],
})
export class FormationModule {}
