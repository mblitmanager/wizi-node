import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { CatalogueFormationController } from "./catalogue-formation.controller";
import { CatalogueFormationService } from "./catalogue-formation.service";

@Module({
  imports: [TypeOrmModule.forFeature([CatalogueFormation])],
  controllers: [CatalogueFormationController],
  providers: [CatalogueFormationService],
  exports: [CatalogueFormationService],
})
export class CatalogueFormationModule {}
