import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParrainageService } from "./parrainage.service";
import { ParrainageController } from "./parrainage.controller";
import { Parrainage } from "../entities/parrainage.entity";
import { ParrainageToken } from "../entities/parrainage-token.entity";
import { ParrainageEvent } from "../entities/parrainage-event.entity";
import { User } from "../entities/user.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { DemandeInscription } from "../entities/demande-inscription.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Parrainage,
      ParrainageToken,
      ParrainageEvent,
      User,
      Stagiaire,
      DemandeInscription,
      CatalogueFormation,
    ]),
  ],
  providers: [ParrainageService],
  controllers: [ParrainageController],
  exports: [ParrainageService],
})
export class ParrainageModule {}
