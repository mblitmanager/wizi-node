import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { StagiaireCatalogueFormation } from "../entities/stagiaire-catalogue-formation.entity";
import { CatalogueFormationController } from "./catalogue-formation.controller";
import { CatalogueFormationService } from "./catalogue-formation.service";

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([
      CatalogueFormation,
      Stagiaire,
      StagiaireCatalogueFormation,
    ]),
  ],
  controllers: [CatalogueFormationController],
  providers: [CatalogueFormationService],
  exports: [CatalogueFormationService],
})
export class CatalogueFormationModule {}
