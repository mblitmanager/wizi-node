import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Classement } from "../entities/classement.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Formation } from "../entities/formation.entity";

@Injectable()
export class StagiaireService {
  constructor(
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(Classement)
    private classementRepository: Repository<Classement>,
    @InjectRepository(CatalogueFormation)
    private catalogueRepository: Repository<CatalogueFormation>,
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>
  ) {}

  async getProfile(userId: number) {
    return this.stagiaireRepository.findOne({
      where: { user_id: userId },
      relations: ["user"],
    });
  }

  async getHomeData(userId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
      relations: [
        "user",
        "formateurs",
        "formateurs.user",
        "commercials",
        "commercials.user",
        "poleRelationClients",
        "poleRelationClients.user",
      ],
    });

    if (!stagiaire) {
      throw new Error("Stagiaire not found");
    }

    // 1. Get basic quiz stats
    const quizStats = await this.classementRepository
      .createQueryBuilder("classement")
      .select("COUNT(*)", "total_quizzes")
      .addSelect("SUM(points)", "total_points")
      .addSelect("AVG(points)", "avg_score")
      .where("classement.stagiaire_id = :id", { id: stagiaire.id })
      .getRawOne();

    // 2. Get last 3 quiz history entries
    const recentHistory = await this.classementRepository.find({
      where: { stagiaire_id: stagiaire.id },
      relations: ["quiz"],
      order: { updated_at: "DESC" },
      take: 3,
    });

    // 3. Get contacts summary
    const mapContact = (contact: any) => ({
      id: contact.id,
      prenom: contact.prenom,
      nom: contact.user?.name || contact.nom || "",
      email: contact.user?.email || contact.email || null,
      telephone: contact.telephone || null,
    });

    const formateurs = stagiaire.formateurs.map(mapContact);
    const commerciaux = stagiaire.commercials.map(mapContact);
    const poleRelation = stagiaire.poleRelationClients.map(mapContact);

    // 4. Get top 3 catalogue formations
    const catalogueFormations = await this.catalogueRepository.find({
      where: { statut: 1 },
      relations: ["formation"],
      take: 3,
    });

    // 5. Get quiz categories
    const categoriesRaw = await this.formationRepository
      .createQueryBuilder("formation")
      .select("DISTINCT formation.categorie", "categorie")
      .where("formation.statut = :statut", { statut: "1" }) // Using string or number depending on DB
      .getRawMany();
    const categories = categoriesRaw.map((c) => c.categorie);

    return {
      user: {
        id: stagiaire.id,
        prenom: stagiaire.prenom,
        image: stagiaire.user?.image || null,
      },
      quiz_stats: {
        total_quizzes: parseInt(quizStats.total_quizzes) || 0,
        total_points: parseInt(quizStats.total_points) || 0,
        average_score: parseFloat(quizStats.avg_score) || 0,
      },
      recent_history: recentHistory,
      contacts: {
        formateurs,
        commerciaux,
        pole_relation: poleRelation,
      },
      catalogue_formations: catalogueFormations,
      categories,
    };
  }

  async getContacts(userId: number) {
    const data = await this.getHomeData(userId);
    return data.contacts;
  }

  async getContactsByType(userId: number, type: string) {
    const data = await this.getHomeData(userId);
    switch (type) {
      case "commercial":
        return data.contacts.commerciaux;
      case "formateur":
        return data.contacts.formateurs;
      case "pole-relation":
      case "pole-save":
        return data.contacts.pole_relation;
      default:
        return [];
    }
  }

  async getStagiaireQuizzes(userId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
    });
    if (!stagiaire) return [];

    return this.classementRepository.find({
      where: { stagiaire_id: stagiaire.id },
      relations: ["quiz"],
    });
  }
}
