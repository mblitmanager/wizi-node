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

  async findAll(): Promise<any[]> {
    const catalogues = await this.catalogueRepository.find({
      where: {
        statut: 1,
      },
      relations: [
        "formation",
        "formateurs",
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.stagiaire",
      ],
      order: {
        created_at: "DESC",
      },
    });

    return catalogues.map((item) => this.formatCatalogueJson(item));
  }

  async findOne(id: number, baseUrl?: string): Promise<any> {
    try {
      const item = await this.catalogueRepository.findOne({
        where: { id },
        relations: [
          "formation",
          "formateurs",
          "stagiaire_catalogue_formations",
          "stagiaire_catalogue_formations.stagiaire",
        ],
      });
      if (!item) {
        throw new NotFoundException("Catalogue formation not found");
      }

      const formatted = this.formatCatalogueJson(item);
      const storageUrl = baseUrl
        ? `${baseUrl}/storage/`
        : "http://localhost:3000/storage/";

      return {
        catalogueFormation: formatted,
        formationId: item.formation_id,
        cursusPdfUrl: item.cursus_pdf
          ? `${storageUrl}${item.cursus_pdf}`
          : null,
      };
    } catch (error) {
      console.error(
        "Detailed Error in CatalogueFormationService.findOne:",
        error
      );
      throw error;
    }
  }

  private formatCatalogueJson(item: CatalogueFormation): any {
    const formatDate = (d: Date | string | null) => {
      if (!d) return null;
      const date = typeof d === "string" ? new Date(d) : d;
      return date.toISOString().split("T")[0];
    };

    const formatDateTime = (d: Date | string | null) => {
      if (!d) return null;
      const date = typeof d === "string" ? new Date(d) : d;
      return date.toISOString().replace("T", " ").substring(0, 19);
    };

    return {
      id: item.id,
      titre: item.titre,
      description: item.description,
      prerequis: item.prerequis,
      image_url: item.image_url,
      cursus_pdf: item.cursus_pdf,
      tarif:
        typeof item.tarif === "number" ? item.tarif.toFixed(2) : item.tarif,
      certification: item.certification,
      statut: item.statut,
      duree: item.duree,
      formation_id: item.formation_id,
      deleted_at: item.deleted_at || null,
      created_at: item.created_at,
      updated_at: item.updated_at,
      objectifs: item.objectifs,
      programme: item.programme,
      modalites: item.modalites,
      modalites_accompagnement: item.modalites_accompagnement,
      moyens_pedagogiques: item.moyens_pedagogiques,
      modalites_suivi: item.modalites_suivi,
      evaluation: item.evaluation,
      lieu: item.lieu,
      niveau: item.niveau,
      public_cible: item.public_cible,
      nombre_participants: item.nombre_participants,
      formation: item.formation
        ? {
            id: item.formation.id,
            titre: item.formation.titre,
            slug: item.formation.slug || null,
            description: item.formation.description,
            statut: item.formation.statut,
            duree: item.formation.duree,
            categorie: item.formation.categorie,
            image: item.formation.image || null,
            icon: item.formation.icon || null,
            created_at: item.formation.created_at,
            updated_at: item.formation.updated_at,
          }
        : null,
      formateurs: (item.formateurs || []).map((f) => ({
        id: f.id,
        role: f.role || "formateur",
        prenom: f.prenom,
        civilite: f.civilite || null,
        user_id: f.user_id,
        telephone: f.telephone,
        deleted_at: f.deleted_at || null,
        created_at: f.created_at,
        updated_at: f.updated_at,
        pivot: {
          catalogue_formation_id: item.id,
          formateur_id: f.id,
        },
      })),
      stagiaires: (item.stagiaire_catalogue_formations || []).map((scf) => ({
        id: scf.stagiaire?.id,
        prenom: scf.stagiaire?.prenom,
        civilite: scf.stagiaire?.civilite,
        telephone: scf.stagiaire?.telephone,
        adresse: scf.stagiaire?.adresse,
        date_naissance: formatDate(scf.stagiaire?.date_naissance),
        ville: scf.stagiaire?.ville,
        code_postal: scf.stagiaire?.code_postal,
        date_debut_formation: formatDate(scf.stagiaire?.date_debut_formation),
        date_inscription: formatDate(scf.stagiaire?.date_inscription),
        role: scf.stagiaire?.role || "stagiaire",
        statut: scf.stagiaire?.statut,
        user_id: scf.stagiaire?.user_id,
        deleted_at: scf.stagiaire?.deleted_at || null,
        created_at: scf.stagiaire?.created_at,
        updated_at: scf.stagiaire?.updated_at,
        date_fin_formation: formatDate(scf.stagiaire?.date_fin_formation),
        login_streak: scf.stagiaire?.login_streak || 0,
        last_login_at: formatDateTime(scf.stagiaire?.last_login_at),
        onboarding_seen: scf.stagiaire?.onboarding_seen ? 1 : 0,
        partenaire_id: scf.stagiaire?.partenaire_id || null,
        pivot: {
          catalogue_formation_id: item.id,
          stagiaire_id: scf.stagiaire_id,
          date_debut: formatDate(scf.date_debut),
          date_inscription: formatDate(scf.date_inscription),
          date_fin: formatDate(scf.date_fin),
          formateur_id: scf.formateur_id,
          created_at: scf.created_at,
          updated_at: scf.updated_at,
        },
      })),
    };
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
        "user",
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.catalogue_formation",
        "stagiaire_catalogue_formations.catalogue_formation.formation",
      ],
    });

    if (!stagiaire) {
      throw new NotFoundException("Stagiaire introuvable");
    }

    const formattedCatalogues = stagiaire.stagiaire_catalogue_formations
      .map((scf) => {
        const catalogue = scf.catalogue_formation;
        if (!catalogue) return null;
        const formation = catalogue.formation;

        const pivot = {
          stagiaire_id: scf.stagiaire_id,
          catalogue_formation_id: scf.catalogue_formation_id,
          date_debut: scf.date_debut,
          date_inscription: scf.date_inscription,
          date_fin: scf.date_fin,
          formateur_id: scf.formateur_id,
          created_at: scf.created_at,
          updated_at: scf.updated_at,
        };

        const catalogueData = {
          id: catalogue.id,
          titre: catalogue.titre,
          description: catalogue.description,
          prerequis: catalogue.prerequis,
          image_url: catalogue.image_url,
          cursus_pdf: catalogue.cursus_pdf,
          tarif: catalogue.tarif,
          certification: catalogue.certification,
          statut: catalogue.statut,
          duree: catalogue.duree,
          formation_id: catalogue.formation_id,
          deleted_at: (catalogue as any).deleted_at || null,
          created_at: catalogue.created_at,
          updated_at: catalogue.updated_at,
          objectifs: catalogue.objectifs,
          programme: catalogue.programme,
          modalites: catalogue.modalites,
          modalites_accompagnement: catalogue.modalites_accompagnement,
          moyens_pedagogiques: catalogue.moyens_pedagogiques,
          modalites_suivi: catalogue.modalites_suivi,
          evaluation: catalogue.evaluation,
          lieu: catalogue.lieu,
          niveau: catalogue.niveau,
          public_cible: catalogue.public_cible,
          nombre_participants: catalogue.nombre_participants,
          pivot: pivot,
          formation: formation
            ? {
                id: formation.id,
                titre: formation.titre,
                slug: (formation as any).slug || null,
                description: formation.description,
                statut: formation.statut,
                duree: formation.duree,
                categorie: formation.categorie,
                image: (formation as any).image || null,
                icon: (formation as any).icon || null,
                created_at: formation.created_at,
                updated_at: formation.updated_at,
              }
            : null,
        };

        return {
          pivot: pivot,
          catalogue: catalogueData,
          formation: catalogueData.formation,
        };
      })
      .filter((item) => item !== null);

    const stagiaireData = {
      id: stagiaire.id,
      prenom: stagiaire.prenom,
      civilite: stagiaire.civilite,
      telephone: stagiaire.telephone,
      adresse: stagiaire.adresse,
      date_naissance: stagiaire.date_naissance,
      ville: stagiaire.ville,
      code_postal: stagiaire.code_postal,
      date_debut_formation: stagiaire.date_debut_formation,
      date_inscription: stagiaire.date_inscription,
      role: stagiaire.role || "stagiaire",
      statut: stagiaire.statut,
      user_id: stagiaire.user_id,
      deleted_at: (stagiaire as any).deleted_at || null,
      created_at: stagiaire.created_at,
      updated_at: stagiaire.updated_at,
      date_fin_formation: stagiaire.date_fin_formation,
      login_streak: stagiaire.login_streak || 0,
      last_login_at:
        stagiaire.last_login_at
          ?.toISOString()
          .replace("T", " ")
          .substring(0, 19) || null,
      onboarding_seen: stagiaire.onboarding_seen ? 1 : 0,
      partenaire_id: stagiaire.partenaire_id || null,
      catalogue_formations: formattedCatalogues.map((item) => item.catalogue),
    };

    return {
      stagiaire: stagiaireData,
      catalogues: formattedCatalogues,
    };
  }
}
