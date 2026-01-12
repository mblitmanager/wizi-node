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

  async getCategories(): Promise<string[]> {
    const rawCategories = await this.formationRepository
      .createQueryBuilder("formation")
      .select("DISTINCT formation.categorie", "categorie")
      .where("formation.categorie IS NOT NULL")
      .getRawMany();

    return rawCategories.map((r) => r.categorie);
  }

  async listFormations(query: { page?: number; baseUrl: string }) {
    const page = query.page || 1;
    const perPage = 10;

    const [items, total] = await this.formationRepository.findAndCount({
      relations: ["catalogue_formations"],
      order: { id: "ASC" },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    const lastPage = Math.ceil(total / perPage);

    const data = items.map((formation) => ({
      id: formation.id,
      titre: formation.titre,
      slug: formation.slug,
      description: formation.description,
      statut: formation.statut,
      duree: formation.duree,
      categorie: formation.categorie,
      image: formation.image,
      icon: formation.icon,
      created_at: this.formatIso(formation.created_at),
      updated_at: this.formatIso(formation.updated_at),
      catalogue_formation: (formation.catalogue_formations || []).map(
        (cat) => ({
          id: cat.id,
          titre: cat.titre,
          description: cat.description,
          prerequis: cat.prerequis,
          image_url: cat.image_url,
          cursus_pdf: cat.cursus_pdf,
          tarif: cat.tarif ? parseFloat(cat.tarif.toString()).toFixed(2) : null,
          certification: cat.certification,
          statut: cat.statut,
          duree: cat.duree,
          formation_id: cat.formation_id,
          deleted_at: null,
          created_at: this.formatIso(cat.created_at),
          updated_at: this.formatIso(cat.updated_at),
          objectifs: cat.objectifs,
          programme: cat.programme,
          modalites: cat.modalites,
          modalites_accompagnement: cat.modalites_accompagnement,
          moyens_pedagogiques: cat.moyens_pedagogiques,
          modalites_suivi: cat.modalites_suivi,
          evaluation: cat.evaluation,
          lieu: cat.lieu,
          niveau: cat.niveau,
          public_cible: cat.public_cible,
          nombre_participants: cat.nombre_participants,
        })
      ),
    }));

    const buildUrl = (p: number) =>
      `${query.baseUrl}/api/formation/listFormation?page=${p}`;

    const links = [];
    links.push({
      url: page > 1 ? buildUrl(page - 1) : null,
      label: "pagination.previous",
      active: false,
    });

    for (let i = 1; i <= lastPage; i++) {
      links.push({
        url: buildUrl(i),
        label: i.toString(),
        active: i === page,
      });
    }

    links.push({
      url: page < lastPage ? buildUrl(page + 1) : null,
      label: "pagination.next",
      active: false,
    });

    return {
      data: {
        current_page: page,
        data,
        first_page_url: buildUrl(1),
        from: (page - 1) * perPage + 1,
        last_page: lastPage,
        last_page_url: buildUrl(lastPage),
        links,
        next_page_url: page < lastPage ? buildUrl(page + 1) : null,
        path: `${query.baseUrl}/api/formation/listFormation`,
        per_page: perPage,
        prev_page_url: page > 1 ? buildUrl(page - 1) : null,
        to: Math.min(page * perPage, total),
        total,
      },
    };
  }

  async getFormationParrainage() {
    const items = await this.catalogueRepository.find({
      relations: [
        "formation",
        "formateurs",
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.stagiaire",
      ],
      order: { id: "ASC" },
    });

    return items.map((cat) => ({
      id: cat.id,
      titre: cat.titre,
      description: cat.description,
      prerequis: cat.prerequis,
      image_url: cat.image_url,
      cursus_pdf: cat.cursus_pdf,
      tarif: cat.tarif ? parseFloat(cat.tarif.toString()).toFixed(2) : null,
      certification: cat.certification,
      statut: cat.statut,
      duree: cat.duree,
      formation_id: cat.formation_id,
      deleted_at: null,
      created_at: this.formatIso(cat.created_at),
      updated_at: this.formatIso(cat.updated_at),
      objectifs: cat.objectifs,
      programme: cat.programme,
      modalites: cat.modalites,
      modalites_accompagnement: cat.modalites_accompagnement,
      moyens_pedagogiques: cat.moyens_pedagogiques,
      modalites_suivi: cat.modalites_suivi,
      evaluation: cat.evaluation,
      lieu: cat.lieu,
      niveau: cat.niveau,
      public_cible: cat.public_cible,
      nombre_participants: cat.nombre_participants,
      formation: cat.formation
        ? {
            id: cat.formation.id,
            titre: cat.formation.titre,
            slug: cat.formation.slug,
            description: cat.formation.description,
            statut: cat.formation.statut,
            duree: cat.formation.duree,
            categorie: cat.formation.categorie,
            image: cat.formation.image,
            icon: cat.formation.icon,
            created_at: this.formatIso(cat.formation.created_at),
            updated_at: this.formatIso(cat.formation.updated_at),
          }
        : null,
      formateurs: (cat.formateurs || []).map((f) => ({
        id: f.id,
        role: f.role,
        prenom: f.prenom,
        civilite: f.civilite,
        user_id: f.user_id,
        telephone: f.telephone,
        deleted_at: null,
        created_at: this.formatIso(f.created_at),
        updated_at: this.formatIso(f.updated_at),
        pivot: {
          catalogue_formation_id: cat.id,
          formateur_id: f.id,
        },
      })),
      stagiaires: (cat.stagiaire_catalogue_formations || []).map((scf) => ({
        id: scf.stagiaire.id,
        prenom: scf.stagiaire.prenom,
        civilite: scf.stagiaire.civilite,
        telephone: scf.stagiaire.telephone,
        adresse: scf.stagiaire.adresse,
        date_naissance: scf.stagiaire.date_naissance,
        ville: scf.stagiaire.ville,
        code_postal: scf.stagiaire.code_postal,
        date_debut_formation: scf.stagiaire.date_debut_formation,
        date_inscription: scf.stagiaire.date_inscription,
        role: scf.stagiaire.role,
        statut: scf.stagiaire.statut,
        user_id: scf.stagiaire.user_id,
        deleted_at: null,
        created_at: this.formatIso(scf.stagiaire.created_at),
        updated_at: this.formatIso(scf.stagiaire.updated_at),
        date_fin_formation: scf.stagiaire.date_fin_formation,
        login_streak: scf.stagiaire.login_streak,
        last_login_at: this.formatIso(scf.stagiaire.last_login_at),
        onboarding_seen: scf.stagiaire.onboarding_seen ? 1 : 0,
        partenaire_id: scf.stagiaire.partenaire_id,
        pivot: {
          catalogue_formation_id: cat.id,
          stagiaire_id: scf.stagiaire.id,
          date_debut: scf.date_debut,
          date_inscription: scf.date_inscription,
          date_fin: scf.date_fin,
          formateur_id: scf.formateur_id,
          created_at: this.formatIso(scf.created_at),
          updated_at: this.formatIso(scf.updated_at),
        },
      })),
    }));
  }

  async getFormationsByCategory(category: string) {
    const allFormations = await this.formationRepository.find({
      relations: ["catalogue_formations"],
      order: { id: "ASC" },
    });

    const result = {};
    allFormations.forEach((formation, index) => {
      if (formation.categorie === category) {
        result[index.toString()] = {
          id: formation.id,
          titre: formation.titre,
          slug: formation.slug,
          description: formation.description,
          statut: formation.statut,
          duree: formation.duree,
          categorie: formation.categorie,
          image: formation.image,
          icon: formation.icon,
          created_at: this.formatIso(formation.created_at),
          updated_at: this.formatIso(formation.updated_at),
          catalogue_formation: (formation.catalogue_formations || []).map(
            (cat) => ({
              id: cat.id,
              titre: cat.titre,
              description: cat.description,
              prerequis: cat.prerequis,
              image_url: cat.image_url,
              cursus_pdf: cat.cursus_pdf,
              tarif: cat.tarif
                ? parseFloat(cat.tarif.toString()).toFixed(2)
                : null,
              certification: cat.certification,
              statut: cat.statut,
              duree: cat.duree,
              formation_id: cat.formation_id,
              deleted_at: null,
              created_at: this.formatIso(cat.created_at),
              updated_at: this.formatIso(cat.updated_at),
              objectifs: cat.objectifs,
              programme: cat.programme,
              modalites: cat.modalites,
              modalites_accompagnement: cat.modalites_accompagnement,
              moyens_pedagogiques: cat.moyens_pedagogiques,
              modalites_suivi: cat.modalites_suivi,
              evaluation: cat.evaluation,
              lieu: cat.lieu,
              niveau: cat.niveau,
              public_cible: cat.public_cible,
              nombre_participants: cat.nombre_participants,
            })
          ),
        };
      }
    });

    return result;
  }

  private formatIso(date: any) {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().replace(".000Z", ".000000Z");
  }
}
