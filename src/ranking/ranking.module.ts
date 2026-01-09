import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RankingService } from "./ranking.service";
import { RankingController } from "./ranking.controller";
import { Classement } from "../entities/classement.entity";
import { Stagiaire } from "../entities/stagiaire.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Classement, Stagiaire])],
  providers: [RankingService],
  controllers: [RankingController],
  exports: [RankingService],
})
export class RankingModule {}
