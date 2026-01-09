import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { StagiaireService } from "./stagiaire.service";
import { StagiaireController } from "./stagiaire.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Stagiaire])],
  providers: [StagiaireService],
  controllers: [StagiaireController],
  exports: [StagiaireService],
})
export class StagiaireModule {}
