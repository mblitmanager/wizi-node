import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
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

  async getCataloguesWithFormations(query: {
    per_page?: number;
    category?: string;
    search?: string;
    page?: number;
  }) {
    const perPage = Number(query.per_page) || 9;
    const page = Number(query.page) || 1;
    const category = query.category;
    const search = query.search;

    const queryBuilder = this.catalogueRepository
      .createQueryBuilder("catalogue")
      .leftJoinAndSelect("catalogue.formation", "formation")
      .leftJoin("catalogue.stagiaire_catalogue_formations", "scf")
      .loadRelationCountAndMap(
        "catalogue.stagiaires_count",
        "catalogue.stagiaire_catalogue_formations"
      )
      .where("catalogue.statut = :statut", { statut: 1 });

    if (category && category !== "Tous") {
      queryBuilder.andWhere("formation.categorie = :category", { category });
    }

    if (search) {
      queryBuilder.andWhere(
        "(catalogue.titre LIKE :search OR catalogue.description LIKE :search)",
        { search: `%${search}%` }
      );
    }

    const [items, total] = await queryBuilder
      .take(perPage)
      .skip((page - 1) * perPage)
      .orderBy("catalogue.created_at", "DESC")
      .getManyAndCount();

    const lastPage = Math.ceil(total / perPage);

    return {
      data: items.map((item) => ({
        id: item.id,
        titre: item.titre,
        description: item.description,
        prerequis: item.prerequis,
        image_url: item.image_url,
        cursus_pdf: item.cursus_pdf,
        tarif: item.tarif,
        certification: item.certification,
        statut: item.statut,
        duree: item.duree,
        created_at: item.created_at,
        updated_at: item.updated_at,
        cursusPdfUrl: item.cursus_pdf ? `storage/${item.cursus_pdf}` : null,
        formation: item.formation
          ? {
              id: item.formation.id,
              titre: item.formation.titre,
              description: item.formation.description,
              categorie: item.formation.categorie,
              duree: item.formation.duree,
              image_url: item.formation.image,
              statut: item.formation.statut,
            }
          : null,
        stagiaires_count: (item as any).stagiaires_count || 0,
      })),
      current_page: page,
      last_page: lastPage,
      total,
      per_page: perPage,
    };
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

    const result = stagiaire.stagiaire_catalogue_formations.map((scf) => {
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

    return {
      stagiaire: stagiaire,
      catalogues: result,
    };
  }
}
