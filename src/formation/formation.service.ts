import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Formation } from "../entities/formation.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";

@Injectable()
export class FormationService {
  constructor(
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>,
    @InjectRepository(CatalogueFormation)
    private catalogueRepository: Repository<CatalogueFormation>
  ) {}

  async getAllFormations() {
    return this.formationRepository.find();
  }

  async getAllCatalogueFormations() {
    return this.catalogueRepository.find({
      where: { statut: 1 },
      relations: ["formation"],
    });
  }

  async getCataloguesWithFormations(query: {
    per_page?: number;
    category?: string;
    search?: string;
  }) {
    const perPage = query.per_page || 9;
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
      .skip(0) // Simplification: assuming page 1 for now or add skip logic
      .getManyAndCount();

    return {
      data: items.map((item) => ({
        ...item,
        formation: item.formation
          ? {
              ...item.formation,
              image_url: item.formation.image, // Mapping formation image to image_url if needed
            }
          : null,
      })),
      total,
      per_page: perPage,
    };
  }

  async getFormationsAndCatalogues(stagiaireId: number) {
    // This replicates getFormationsAndCatalogues in Laravel
    return this.catalogueRepository.find({
      where: {
        stagiaire_catalogue_formations: { stagiaire_id: stagiaireId },
      },
      relations: ["formation"],
    });
  }
}
