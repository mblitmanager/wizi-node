import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DemandeInscription } from "../entities/demande-inscription.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class InscriptionService {
  constructor(
    @InjectRepository(DemandeInscription)
    private demandeRepository: Repository<DemandeInscription>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(CatalogueFormation)
    private catalogueRepository: Repository<CatalogueFormation>,
    private notificationService: NotificationService
  ) {}

  async inscrire(userId: number, catalogueFormationId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
      relations: ["catalogue_formations", "user"],
    });

    if (!stagiaire) {
      throw new Error("Stagiaire not found");
    }

    const catalogueFormation = await this.catalogueRepository.findOne({
      where: { id: catalogueFormationId },
    });

    if (!catalogueFormation) {
      throw new Error("Formation not found");
    }

    // syncWithoutDetaching logic:
    // Check if already enrolled
    const alreadyEnrolled = stagiaire.catalogue_formations.some(
      (cf) => cf.id === catalogueFormationId
    );

    if (!alreadyEnrolled) {
      stagiaire.catalogue_formations.push(catalogueFormation);
      await this.stagiaireRepository.save(stagiaire);
    }

    // Create DemandeInscription entry
    const demande = this.demandeRepository.create({
      parrain_id: userId,
      filleul_id: userId,
      formation_id: catalogueFormationId,
      statut: "en_attente",
      date_demande: new Date(),
      date_inscription: new Date(),
      motif: "Demande d'inscription à une formation",
      donnees_formulaire: JSON.stringify({
        type: "inscription_directe",
        formation_id: catalogueFormationId,
        date: new Date().toISOString(),
        user_id: userId,
      }),
    });

    const savedDemande = await this.demandeRepository.save(demande);

    // Notify user
    await this.notificationService.createNotification(
      userId,
      "inscription",
      "Nous avons bien reçu votre demande d'inscription, votre conseiller/conseillère va prendre contact avec vous."
    );

    return {
      success: true,
      message:
        "Un mail de confirmation vous a été envoyé, votre conseiller va bientôt prendre contact avec vous.",
      demande: savedDemande,
    };
  }
}
