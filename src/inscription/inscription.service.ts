import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DemandeInscription } from "../entities/demande-inscription.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { StagiaireCatalogueFormation } from "../entities/stagiaire-catalogue-formation.entity";
import { NotificationService } from "../notification/notification.service";
import { MailService } from "../mail/mail.service";
import { join } from "path";

@Injectable()
export class InscriptionService {
  constructor(
    @InjectRepository(DemandeInscription)
    private demandeRepository: Repository<DemandeInscription>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(CatalogueFormation)
    private catalogueRepository: Repository<CatalogueFormation>,
    @InjectRepository(StagiaireCatalogueFormation)
    private scfRepository: Repository<StagiaireCatalogueFormation>,
    private notificationService: NotificationService,
    private mailService: MailService
  ) {}

  async inscrire(userId: number, catalogueFormationId: number) {
    try {
      const stagiaire = await this.stagiaireRepository.findOne({
        where: { user_id: userId },
        relations: ["stagiaire_catalogue_formations", "user"],
      });

      if (!stagiaire) {
        throw new Error("Aucun stagiaire associé à cet utilisateur.");
      }

      const catalogueFormation = await this.catalogueRepository.findOne({
        where: { id: catalogueFormationId },
      });

      if (!catalogueFormation) {
        throw new Error("Formation not found");
      }

    // syncWithoutDetaching logic:
    // Check if already enrolled
    const alreadyEnrolled = stagiaire.stagiaire_catalogue_formations.some(
      (scf) => scf.catalogue_formation_id === catalogueFormationId
    );

    if (!alreadyEnrolled) {
      const scf = this.scfRepository.create({
        stagiaire_id: stagiaire.id,
        catalogue_formation_id: catalogueFormationId,
        date_inscription: new Date(),
      });
      await this.scfRepository.save(scf);
    }

    // Create DemandeInscription entry
    const demande = this.demandeRepository.create({
      parrain_id: null, // Pas de parrain pour une inscription directe (comme dans Laravel)
      filleul_id: userId, // L'utilisateur qui s'inscrit
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
      lien_parrainage: null,
    });

    const savedDemande = await this.demandeRepository.save(demande);

    // Notify user via in-app notification (ne doit pas faire échouer l'inscription)
    try {
      await this.notificationService.createNotification(
        userId,
        "inscription",
        "Nous avons bien reçu votre demande d'inscription, votre conseiller/conseillère va prendre contact avec vous."
      );
    } catch (notificationError) {
      // Log l'erreur mais continue le processus d'inscription
      console.warn(
        "Erreur lors de l'envoi de la notification (inscription non affectée):",
        notificationError
      );
    }

    // Prepare all email promises
    const emailPromises = [];

    // Send confirmation email to Stagiaire
    emailPromises.push(
      this.mailService
        .sendMail(
          stagiaire.user.email,
          "Confirmation d'inscription à une formation - Wizi Learn",
          "inscription_catalogue",
          {
            firstName: stagiaire.prenom || stagiaire.user.name,
            lastName: stagiaire.user.name,
            civility: stagiaire.civilite || "Non renseigné",
            phone: stagiaire.telephone || "Non renseigné",
            email: stagiaire.user.email,
            formationTitle: catalogueFormation.titre,
            formationDuration: catalogueFormation.duree,
            formationPrice: catalogueFormation.tarif
              ? new Intl.NumberFormat("fr-FR").format(catalogueFormation.tarif)
              : null,
            prerequis: catalogueFormation.prerequis || null,
            isPoleRelation: false,
          },
          [
            {
              filename: "aopia.png",
              path: join(process.cwd(), "src/mail/templates/assets/aopia.png"),
              cid: "aopia",
            },
            {
              filename: "like.png",
              path: join(process.cwd(), "src/mail/templates/assets/like.png"),
              cid: "like",
            },
          ]
        )
        .catch((mailError) => {
          console.error(
            "Failed to send inscription confirmation email:",
            mailError
          );
        })
    );

    // Send notification email to Pole Relation (Backoffice)
    const notificationEmails = [
      "adv@aopia.fr",
      "alexandre.florek@aopia.fr",
      "mbl.service.mada2@gmail.com",
    ];

    for (const email of notificationEmails) {
      emailPromises.push(
        this.mailService
          .sendMail(
            email,
            "Nouvelle inscription à une formation - Wizi Learn",
            "inscription_catalogue",
            {
              firstName: stagiaire.prenom || stagiaire.user.name,
              lastName: stagiaire.user.name,
              civility: stagiaire.civilite || "Non renseigné",
              phone: stagiaire.telephone || "Non renseigné",
              email: stagiaire.user.email,
              formationTitle: catalogueFormation.titre,
              formationDuration: catalogueFormation.duree,
              formationPrice: catalogueFormation.tarif
                ? new Intl.NumberFormat("fr-FR").format(
                    catalogueFormation.tarif
                  )
                : null,
              prerequis: catalogueFormation.prerequis || null,
              isPoleRelation: true,
            },
            [
              {
                filename: "aopia.png",
                path: join(
                  process.cwd(),
                  "src/mail/templates/assets/aopia.png"
                ),
                cid: "aopia",
              },
              {
                filename: "like.png",
                path: join(process.cwd(), "src/mail/templates/assets/like.png"),
                cid: "like",
              },
            ]
          )
          .catch((mailError) => {
            console.error(
              `Failed to send backoffice notification email to ${email}:`,
              mailError
            );
          })
      );
    }

      // Wait for all messages to be dispatched (parallely)
      await Promise.all(emailPromises);

      return {
        success: true,
        message:
          "Un mail de confirmation vous a été envoyé, votre conseiller va bientôt prendre contact avec vous.",
        demande: savedDemande,
      };
    } catch (error) {
      console.error("Erreur lors de l'inscription au catalogue formation:", {
        user_id: userId,
        catalogue_formation_id: catalogueFormationId,
        error: error.message,
        stack: error.stack,
      });

      throw new Error(
        error.message || "Une erreur est survenue lors de l'inscription."
      );
    }
  }
}
