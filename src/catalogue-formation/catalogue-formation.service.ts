import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Stagiaire } from "../entities/stagiaire.entity";

@Injectable()
export class CatalogueFormationService {
  constructor(
    @InjectRepository(CatalogueFormation)
    private readonly catalogueRepository: Repository<CatalogueFormation>,
    @InjectRepository(Stagiaire)
    private readonly stagiaireRepository: Repository<Stagiaire>
  ) {}

  async findAll(): Promise<CatalogueFormation[]> {
    return this.catalogueRepository.find({
      where: {
        statut: 1,
        formation: {
          statut: 1,
        },
      },
      relations: ["formation"],
      order: {
        created_at: "DESC",
      },
    });
  }

  async findOne(id: number): Promise<CatalogueFormation> {
    try {
      const formation = await this.catalogueRepository.findOne({
        where: { id },
        relations: [
          "formation",
          "formateurs",
          "stagiaire_catalogue_formations",
          "stagiaire_catalogue_formations.stagiaire",
        ],
      });
      if (!formation) {
        throw new NotFoundException("Catalogue formation not found");
      }
      return formation;
    } catch (error) {
      console.error(
        "Detailed Error in CatalogueFormationService.findOne:",
        error
      );
      throw error;
    }
  }

  async getFormationsAndCatalogues(stagiaireId: number): Promise<any> {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id: stagiaireId },
      relations: [
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.catalogue_formation",
        "stagiaire_catalogue_formations.catalogue_formation.formation",
      ],
    });

    if (!stagiaire) {
      throw new NotFoundException("Stagiaire introuvable");
    }

    const catalogues = stagiaire.stagiaire_catalogue_formations.map((scf) => {
      const catalogue = scf.catalogue_formation;
      const formation = catalogue.formation;

      return {
        pivot: {
          stagiaire_id: scf.stagiaire_id,
          catalogue_formation_id: scf.catalogue_formation_id,
          date_debut: scf.date_debut,
          date_inscription: scf.date_inscription,
          date_fin: scf.date_fin,
          formateur_id: scf.formateur_id,
          created_at: scf.created_at,
          updated_at: scf.updated_at,
        },
        catalogue: {
          ...catalogue,
          formation: formation,
        },
        formation: formation,
      };
    });

    // We also need to add the catalogue_formations array to the stagiaire object
    // to match Laravel's $stagiaire->toArray() which includes loaded relations
    const stagiaireData = {
      ...stagiaire,
      catalogue_formations: stagiaire.stagiaire_catalogue_formations.map(
        (scf) => ({
          ...scf.catalogue_formation,
          pivot: {
            stagiaire_id: scf.stagiaire_id,
            catalogue_formation_id: scf.catalogue_formation_id,
            date_debut: scf.date_debut,
            date_inscription: scf.date_inscription,
            date_fin: scf.date_fin,
            formateur_id: scf.formateur_id,
            created_at: scf.created_at,
            updated_at: scf.updated_at,
          },
        })
      ),
    };

    // Remove the bridge relation from the final object to keep it clean like Laravel
    delete (stagiaireData as any).stagiaire_catalogue_formations;

    return {
      stagiaire: stagiaireData,
      catalogues: catalogues,
    };
  }
}
