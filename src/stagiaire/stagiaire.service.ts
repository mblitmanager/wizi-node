import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Classement } from "../entities/classement.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Formation } from "../entities/formation.entity";
import { Quiz } from "../entities/quiz.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { In } from "typeorm";
import { RankingService } from "../ranking/ranking.service";
import { User } from "../entities/user.entity";
import * as bcrypt from "bcrypt";
import { AgendaService } from "../agenda/agenda.service";
import { MediaService } from "../media/media.service";

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
    private formationRepository: Repository<Formation>,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(QuizParticipation)
    private participationRepository: Repository<QuizParticipation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rankingService: RankingService,
    private agendaService: AgendaService,
    private mediaService: MediaService
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
      throw new NotFoundException(`Stagiaire with user_id ${userId} not found`);
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
    const mapContact = (contact: any, type: string) => ({
      id: contact?.id,
      prenom: contact?.prenom,
      nom: contact?.nom || contact?.user?.name?.split(" ").pop() || "",
      email: contact?.user?.email || contact?.email || null,
      telephone: contact?.telephone || null,
      role: contact?.role || type,
      civilite: contact?.civilite || null,
      image: contact?.user?.image || null,
      type: type,
    });

    const formateurs = (stagiaire.formateurs || []).map((c) =>
      mapContact(c, "formateur")
    );
    const commerciaux = (stagiaire.commercials || []).map((c) =>
      mapContact(c, "commercial")
    );
    const poleRelation = (stagiaire.poleRelationClients || []).map((c) =>
      mapContact(c, "pole_relation_client")
    );

    const catalogueFormations = await this.catalogueRepository.find({
      where: { statut: 1 },
      relations: ["formation"],
      take: 3,
    });

    // 5. Get quiz categories
    const categoriesRaw = await this.formationRepository
      .createQueryBuilder("formation")
      .select("DISTINCT formation.categorie", "categorie")
      .where("formation.statut = :statut", { statut: 1 }) // Using number
      .getRawMany();
    const categories = categoriesRaw.map((c) => c.categorie);

    return {
      user: {
        id: stagiaire.id,
        prenom: stagiaire.prenom,
        image: stagiaire.user?.image || null,
      },
      quiz_stats: {
        total_quizzes: parseInt(quizStats?.total_quizzes || "0") || 0,
        total_points: parseInt(quizStats?.total_points || "0") || 0,
        average_score: parseFloat(quizStats?.avg_score || "0") || 0,
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
    // Ensure only mapped fields are returned, no extra nested objects
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
    try {
      const stagiaire = await this.stagiaireRepository.findOne({
        where: { user_id: userId },
        relations: [
          "stagiaire_catalogue_formations",
          "stagiaire_catalogue_formations.catalogue_formation",
          "stagiaire_catalogue_formations.catalogue_formation.formation",
        ],
      });

      if (!stagiaire) return { data: [] };

      // Get all unique formation_ids from catalogue_formations
      const formationIds = (stagiaire.stagiaire_catalogue_formations || [])
        .map((scf) => scf.catalogue_formation?.formation_id)
        .filter((id) => id !== null && id !== undefined);

      if (formationIds.length === 0) return { data: [] };

      // Get quizzes for these formations (without heavy relations for now)
      const quizzes = await this.quizRepository.find({
        where: {
          formation_id: In(formationIds),
        },
        relations: ["formation"],
      });

      // Get participation data separately
      const participations = await this.participationRepository.find({
        where: { user_id: userId },
      });

      const mappedQuizzes = quizzes.map((quiz) => {
        // Find participation for this quiz
        const participation = participations.find((p) => p.quiz_id === quiz.id);

        return {
          id: quiz.id.toString(),
          titre: quiz.titre,
          description: quiz.description,
          duree: quiz.duree || null,
          niveau: quiz.niveau || "débutant",
          status: quiz.status || "actif",
          nb_points_total: Number(quiz.nb_points_total) || 0,
          formationId: quiz.formation_id?.toString(),
          categorie: quiz.formation?.categorie || null,
          formation: quiz.formation
            ? {
                id: quiz.formation.id,
                titre: quiz.formation.titre || null,
                categorie: quiz.formation.categorie || null,
              }
            : null,
          questions: [],
          userParticipation: participation
            ? {
                id: participation.id,
                status: participation.status,
                score: participation.score,
                correct_answers: participation.correct_answers,
                time_spent: participation.time_spent,
                started_at: participation.started_at
                  ? participation.started_at.toISOString()
                  : null,
                completed_at: participation.completed_at
                  ? participation.completed_at.toISOString()
                  : null,
              }
            : null,
        };
      });

      return { data: mappedQuizzes };
    } catch (error) {
      console.error("Error in getStagiaireQuizzes:", error);
      throw new Error(`Failed to get stagiaire quizzes: ${error.message}`);
    }
  }

  async getFormationsByStagiaire(stagiaireId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id: stagiaireId },
      relations: [
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.catalogue_formation",
        "stagiaire_catalogue_formations.catalogue_formation.formation",
        "stagiaire_catalogue_formations.catalogue_formation.formation.medias",
      ],
    });

    if (!stagiaire) {
      throw new NotFoundException("Stagiaire not found");
    }

    // Group formations by formation_id and build the expected structure
    const formationMap = new Map();

    stagiaire.stagiaire_catalogue_formations?.forEach((scf) => {
      const formation = scf.catalogue_formation.formation;
      if (formation) {
        if (!formationMap.has(formation.id)) {
          formationMap.set(formation.id, {
            id: formation.id,
            titre: formation.titre,
            slug: formation.slug,
            description: formation.description,
            statut: formation.statut,
            duree: formation.duree,
            categorie: formation.categorie,
            image: formation.image,
            icon: formation.icon,
            created_at: formation.created_at,
            updated_at: formation.updated_at,
            medias: formation.medias || [],
            catalogue_formation: [],
          });
        }
        // Add catalogue_formation to the array
        formationMap.get(formation.id).catalogue_formation.push({
          id: scf.catalogue_formation.id,
          titre: scf.catalogue_formation.titre,
          description: scf.catalogue_formation.description,
          prerequis: scf.catalogue_formation.prerequis,
          image_url: scf.catalogue_formation.image_url,
          cursus_pdf: scf.catalogue_formation.cursus_pdf,
          tarif: scf.catalogue_formation.tarif,
          certification: scf.catalogue_formation.certification,
          statut: scf.catalogue_formation.statut,
          duree: scf.catalogue_formation.duree,
          formation_id: scf.catalogue_formation.formation_id,
          created_at: scf.catalogue_formation.created_at,
          updated_at: scf.catalogue_formation.updated_at,
          objectifs: scf.catalogue_formation.objectifs,
          programme: scf.catalogue_formation.programme,
          modalites: scf.catalogue_formation.modalites,
          modalites_accompagnement:
            scf.catalogue_formation.modalites_accompagnement,
          moyens_pedagogiques: scf.catalogue_formation.moyens_pedagogiques,
          modalites_suivi: scf.catalogue_formation.modalites_suivi,
          evaluation: scf.catalogue_formation.evaluation,
          lieu: scf.catalogue_formation.lieu,
          niveau: scf.catalogue_formation.niveau,
          public_cible: scf.catalogue_formation.public_cible,
          nombre_participants: scf.catalogue_formation.nombre_participants,
        });
      }
    });

    return {
      success: true,
      data: Array.from(formationMap.values()),
    };
  }

  async getStagiaireById(id: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id },
      relations: [
        "user",
        "formateurs",
        "formateurs.user",
        "commercials",
        "commercials.user",
        "poleRelationClients",
        "poleRelationClients.user",
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.catalogue_formation",
        "stagiaire_catalogue_formations.catalogue_formation.formation",
      ],
    });

    if (!stagiaire) {
      throw new NotFoundException("Stagiaire not found");
    }

    // Get quiz stats
    const stats = await this.classementRepository
      .createQueryBuilder("classement")
      .select("COUNT(DISTINCT classement.quiz_id)", "totalCompleted")
      .addSelect("SUM(classement.points)", "totalPoints")
      .where("classement.stagiaire_id = :id", { id: stagiaire.id })
      .getRawOne();

    // Calculate rank
    const allStats = await this.classementRepository
      .createQueryBuilder("classement")
      .select("stagiaire_id")
      .addSelect("SUM(points)", "total")
      .groupBy("stagiaire_id")
      .orderBy("total", "DESC")
      .getRawMany();

    const rank = allStats.findIndex((s) => parseInt(s.stagiaire_id) === id) + 1;

    // Last activity
    const lastRanking = await this.classementRepository.findOne({
      where: { stagiaire_id: stagiaire.id },
      order: { updated_at: "DESC" },
    });

    // Get quiz stats grouped by level
    const levelStats = await this.classementRepository
      .createQueryBuilder("classement")
      .innerJoin("classement.quiz", "quiz")
      .select("quiz.niveau", "level")
      .addSelect("COUNT(DISTINCT classement.quiz_id)", "completed")
      .where("classement.stagiaire_id = :id", { id: stagiaire.id })
      .groupBy("quiz.niveau")
      .getRawMany();

    // Get total quizzes by level for reference
    const totalByLevel = await this.classementRepository.manager
      .getRepository("Quiz")
      .createQueryBuilder("quiz")
      .select("quiz.niveau", "level")
      .addSelect("COUNT(*)", "total")
      .where("quiz.status = :status", { status: "actif" })
      .groupBy("quiz.niveau")
      .getRawMany();

    const getStatForLevel = (levelName: string) => {
      const completed =
        levelStats.find(
          (s) => s.level?.toLowerCase() === levelName.toLowerCase()
        )?.completed || 0;
      const total =
        totalByLevel.find(
          (t) => t.level?.toLowerCase() === levelName.toLowerCase()
        )?.total || 0;
      return { completed: parseInt(completed), total: parseInt(total) };
    };

    // Extract last name parts for initial formatting
    const [fName, ...lParts] = (stagiaire.user?.name || "").split(" ");
    const lEx = lParts.join(" ") || "";

    return {
      id: stagiaire.id,
      firstname: stagiaire.prenom || fName || "Anonyme",
      lastname: lEx,
      name: lEx,
      avatar: stagiaire.user?.image || null,
      rang: rank || 0,
      totalPoints: parseInt(stats?.totalPoints || "0"),
      formations: (stagiaire.stagiaire_catalogue_formations || []).map(
        (scf) => ({
          id: scf.catalogue_formation?.id,
          titre: scf.catalogue_formation?.formation?.titre || "N/A",
        })
      ),
      formateurs: (stagiaire.formateurs || []).map((f) => ({
        id: f.id,
        prenom: f.prenom || "",
        nom: f.nom || f.user?.name?.split(" ").slice(1).join(" ") || "",
        image: f.user?.image || null,
      })),
      quizStats: {
        totalCompleted: parseInt(stats?.totalCompleted || "0"),
        totalQuiz: parseInt(
          totalByLevel.reduce((acc, curr) => acc + parseInt(curr.total), 0)
        ),
        pourcentageReussite:
          stats?.totalCompleted > 0
            ? Math.round(
                (parseInt(stats.totalCompleted) /
                  totalByLevel.reduce(
                    (acc, curr) => acc + parseInt(curr.total),
                    0
                  )) *
                  100
              )
            : 0,
        byLevel: {
          debutant: getStatForLevel("Débutant"),
          intermediaire: getStatForLevel("Intermédiaire"),
          expert: getStatForLevel("Expert"),
        },
        lastActivity: lastRanking?.updated_at || null,
      },
    };
  }

  async getMyPartner(userId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
      relations: ["partenaire", "partenaires"],
    });

    if (!stagiaire) {
      throw new NotFoundException(`Stagiaire with user_id ${userId} not found`);
    }

    // Priority: direct relation partenaire_id
    let partenaire = stagiaire.partenaire;

    // Fallback: via ManyToMany relation (partenaires)
    if (
      !partenaire &&
      stagiaire.partenaires &&
      stagiaire.partenaires.length > 0
    ) {
      partenaire = stagiaire.partenaires[0];
    }

    if (!partenaire) {
      throw new NotFoundException("Aucun partenaire associé");
    }

    return {
      identifiant: partenaire.identifiant,
      type: partenaire.type,
      adresse: partenaire.adresse,
      ville: partenaire.ville,
      departement: partenaire.departement,
      code_postal: partenaire.code_postal,
      logo: partenaire.logo,
      actif: Boolean(partenaire.actif ?? true),
      contacts: partenaire.contacts ?? [],
    };
  }

  async getDetailedProfile(userId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
      relations: ["user"],
    });

    if (!stagiaire) {
      throw new NotFoundException(`Stagiaire not found`);
    }

    return {
      id: stagiaire.id,
      prenom: stagiaire.prenom,
      nom: stagiaire.user?.name || "",
      telephone: stagiaire.telephone,
      ville: stagiaire.ville,
      code_postal: stagiaire.code_postal,
      adresse: stagiaire.adresse,
      email: stagiaire.user?.email,
      image: stagiaire.user?.image,
    };
  }

  async updatePassword(userId: number, data: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    const isMatch = await bcrypt.compare(data.current_password, user.password);
    if (!isMatch) {
      throw new Error("Current password does not match");
    }

    user.password = await bcrypt.hash(data.new_password, 10);
    await this.userRepository.save(user);
    return true;
  }

  async updateProfilePhoto(userId: number, photoPath: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    user.image = photoPath;
    await this.userRepository.save(user);
    return true;
  }

  async setOnboardingSeen(userId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
    });
    if (!stagiaire) throw new NotFoundException("Stagiaire not found");

    stagiaire.onboarding_seen = true;
    await this.stagiaireRepository.save(stagiaire);
    return true;
  }

  async getOnlineUsers() {
    // Current user and others who are online
    const online = await this.userRepository.find({
      where: { is_online: true },
      select: ["id", "name", "image", "last_activity_at"],
      order: { last_activity_at: "DESC" },
    });

    const recentlyOnline = await this.userRepository.find({
      where: { is_online: false },
      select: ["id", "name", "image", "last_activity_at"],
      order: { last_activity_at: "DESC" },
      take: 10,
    });

    return {
      online_users: online,
      recently_online: recentlyOnline,
      all_users: [...online, ...recentlyOnline],
    };
  }
}
