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
    private participationRepository: Repository<QuizParticipation>
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
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
      relations: ["catalogue_formations"],
    });

    if (!stagiaire) return { data: [] };

    const formationIds = (stagiaire.catalogue_formations || [])
      .map((cat) => cat.formation_id)
      .filter((id) => id !== null);

    if (formationIds.length === 0) return { data: [] };

    const quizzes = await this.quizRepository.find({
      where: {
        status: "actif",
        formation_id: In(formationIds),
      },
      relations: ["formation", "questions", "questions.reponses"],
    });

    const participations = await this.participationRepository.find({
      where: { user_id: userId },
      order: { created_at: "DESC" }, // Force DESC order to match Laravel's last participation logic
    });

    const mappedQuizzes = quizzes.map((quiz) => {
      // Find the most recent participation for this quiz
      const participation = participations.find((p) => p.quiz_id === quiz.id);

      return {
        id: quiz.id.toString(),
        titre: quiz.titre,
        description: quiz.description,
        duree: quiz.duree || null,
        niveau: quiz.niveau || "débutant",
        status: quiz.status || "actif",
        nb_points_total: Number(quiz.nb_points_total) || 0, // Convert to Number for parity
        formationId: quiz.formation_id?.toString(),
        categorie: quiz.formation?.categorie || null,
        formation: quiz.formation
          ? {
              id: quiz.formation.id,
              titre: quiz.formation.titre || null,
              categorie: quiz.formation.categorie || null,
            }
          : null,
        questions: (quiz.questions || []).map((q) => ({
          id: q.id.toString(),
          text: q.text || null,
          type: q.type || null,
          points: Number(q.points) || 0, // Convert to Number for parity
          answers: (q.reponses || []).map((r) => ({
            id: r.id.toString(),
            text: r.text,
            isCorrect: Boolean(r.isCorrect),
          })),
        })),
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
  }

  async getFormationsByStagiaire(stagiaireId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id: stagiaireId },
      relations: ["catalogue_formations", "catalogue_formations.formation"],
    });

    if (!stagiaire) {
      throw new NotFoundException("Stagiaire not found");
    }

    return stagiaire.catalogue_formations || [];
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
        "catalogue_formations",
        "catalogue_formations.formation",
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
      formations: (stagiaire.catalogue_formations || []).map((cf) => ({
        id: cf.id,
        titre: cf.formation?.titre || "N/A",
      })),
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
}
