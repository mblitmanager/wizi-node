import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InscriptionService } from "./inscription.service";
import { InscriptionController } from "./inscription.controller";
import { DemandeInscription } from "../entities/demande-inscription.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { StagiaireCatalogueFormation } from "../entities/stagiaire-catalogue-formation.entity";
import { NotificationModule } from "../notification/notification.module";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DemandeInscription,
      Stagiaire,
      CatalogueFormation,
      StagiaireCatalogueFormation,
    ]),
    NotificationModule,
    MailModule,
  ],
  providers: [InscriptionService],
  controllers: [InscriptionController],
  exports: [InscriptionService],
})
export class InscriptionModule {}
