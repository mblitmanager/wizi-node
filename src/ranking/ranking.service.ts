import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { Classement } from "../entities/classement.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { Progression } from "../entities/progression.entity";
import { Quiz } from "../entities/quiz.entity";
import { User } from "../entities/user.entity";
import { Formation } from "../entities/formation.entity";

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Classement)
    private classementRepository: Repository<Classement>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(QuizParticipation)
    private participationRepository: Repository<QuizParticipation>,
    @InjectRepository(Progression)
    private progressionRepository: Repository<Progression>,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>
  ) {}

  async getFormationsRankingSummary() {
    const formations = await this.formationRepository.find({
      order: { id: "ASC" },
    });

    const summary = [];

    for (const formation of formations) {
      // Find all classements for quizzes in this formation
      const classements = await this.classementRepository.find({
        where: { quiz: { formation_id: formation.id } },
        relations: ["stagiaire", "stagiaire.user"],
      });

      const grouped: {
        [key: number]: { nom_complet: string; total_points: number };
      } = {};

      classements.forEach((c) => {
        const sid = c.stagiaire_id;
        if (!grouped[sid]) {
          grouped[sid] = {
            nom_complet:
              `${c.stagiaire.prenom || ""} ${c.stagiaire.user?.name || ""}`.trim() ||
              " ",
            total_points: 0,
          };
        }
        grouped[sid].total_points += c.points || 0;
      });

      const top_3 = Object.values(grouped)
        .sort((a, b) => b.total_points - a.total_points)
        .slice(0, 3)
        .map((item, index) => ({
          rang: index + 1,
          ...item,
        }));

      summary.push({
        id: formation.id,
        titre: formation.titre,
        has_ranking: top_3.length > 0,
        top_3,
      });
    }

    return { formations: summary };
  }

  async findAllPaginated(page: number = 1, limit: number = 10) {
    const [items, total] = await this.classementRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { id: "ASC" },
    });

    return { items, total };
  }

  async getGlobalRanking(period: string = "all") {
    let query = this.classementRepository
      .createQueryBuilder("c")
      .leftJoinAndSelect("c.stagiaire", "stagiaire")
      .leftJoinAndSelect("stagiaire.user", "user")
      .leftJoinAndSelect("stagiaire.formateurs", "formateurs")
      .leftJoinAndSelect("formateurs.user", "formateurUser")
      .leftJoinAndSelect("stagiaire.stagiaire_catalogue_formations", "scf")
      .leftJoinAndSelect("scf.catalogue_formation", "catalogueFormation")
      .leftJoinAndSelect("catalogueFormation.formation", "formation")
      .leftJoinAndSelect("c.quiz", "quiz");

    // Apply period filter if needed
    if (period === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.where("c.updated_at >= :weekAgo", { weekAgo });
    } else if (period === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.where("c.updated_at >= :monthAgo", { monthAgo });
    }

    const allClassements = await query.getMany();

    // Group by stagiaire_id and calculate totals
    const groupedByStagiaire: { [key: number]: any[] } = {};
    allClassements.forEach((classement) => {
      const stagiaireId = classement.stagiaire_id;
      if (!groupedByStagiaire[stagiaireId]) {
        groupedByStagiaire[stagiaireId] = [];
      }
      groupedByStagiaire[stagiaireId].push(classement);
    });

    const ranking = Object.keys(groupedByStagiaire)
      .map((stagiaireId) => {
        const group = groupedByStagiaire[stagiaireId];
        const totalPoints = group.reduce(
          (sum, item) => sum + (item.points || 0),
          0
        );
        const quizCount = group.length;
        const averageScore = quizCount > 0 ? totalPoints / quizCount : 0;
        const first = group[0];
        const stagiaire = first.stagiaire;

        // Map formateurs with their assigned formations
        const formateurs = stagiaire.formateurs
          ? stagiaire.formateurs.map((formateur) => {
              // Get formations assigned to this stagiaire by this formateur
              const formationsAssignees =
                stagiaire.stagiaire_catalogue_formations
                  ?.filter((scf) => scf.formateur_id === formateur.id)
                  ?.map((scf) => ({
                    id: scf.catalogue_formation?.id,
                    titre: scf.catalogue_formation?.titre,
                    description: scf.catalogue_formation?.description,
                    duree: scf.catalogue_formation?.duree,
                    tarif: scf.catalogue_formation?.tarif,
                    statut: scf.catalogue_formation?.statut,
                    image_url: scf.catalogue_formation?.image_url,
                    formation: scf.catalogue_formation?.formation
                      ? {
                          id: scf.catalogue_formation.formation.id,
                          titre: scf.catalogue_formation.formation.titre,
                          categorie:
                            scf.catalogue_formation.formation.categorie,
                          icon: scf.catalogue_formation.formation.icon,
                        }
                      : null,
                  })) || [];

              return {
                id: formateur.id,
                civilite: formateur.civilite,
                prenom: formateur.prenom,
                nom: formateur.user?.name,
                telephone: formateur.telephone,
                image: formateur.user?.image || null,
                formations: formationsAssignees,
              };
            })
          : [];

        // Filter formateurs that have at least one formation assigned
        const filteredFormateurs = formateurs.filter(
          (f) => f.formations && f.formations.length > 0
        );

        return {
          stagiaire: {
            id: stagiaire.id.toString(),
            prenom: stagiaire.prenom,
            nom: stagiaire.user?.name || "",
            image: stagiaire.user?.image || null,
          },
          formateurs: filteredFormateurs,
          totalPoints,
          quizCount,
          averageScore: Math.round(averageScore * 100) / 100,
        };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints);

    // Add ranking
    return ranking.map((item, index) => ({
      ...item,
      rang: index + 1,
      level: this.calculateLevel(item.totalPoints),
    }));
  }

  async getMyRanking(userId: number) {
    const globalRanking = await this.getGlobalRanking();
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
    });

    if (!stagiaire) {
      throw new NotFoundException("Stagiaire not found");
    }

    const myRanking = globalRanking.find(
      (item) => item.stagiaire.id === stagiaire.id.toString()
    );

    if (!myRanking) {
      return {
        stagiaire: {
          id: stagiaire.id.toString(),
          prenom: stagiaire.prenom,
          image: null,
        },
        totalPoints: 0,
        quizCount: 0,
        averageScore: 0,
        rang: globalRanking.length + 1,
      };
    }

    return myRanking;
  }

  async getFormationRanking(formationId: number) {
    // Laravel uses progressions for formation ranking
    const progressions = await this.progressionRepository.find({
      where: { formation_id: formationId },
      relations: ["stagiaire", "stagiaire.user"],
      order: { score: "DESC" },
    });

    return progressions.map((p, index) => ({
      id: p.stagiaire.user_id,
      name: p.stagiaire.user?.name || "",
      points: p.score,
      rang: index + 1,
    }));
  }

  async getStagiaireProgress(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        "stagiaire",
        "stagiaire.formateurs",
        "stagiaire.formateurs.user",
        "stagiaire.commercials",
        "stagiaire.stagiaire_catalogue_formations",
        "stagiaire.stagiaire_catalogue_formations.catalogue_formation",
      ],
    });

    if (!user || !user.stagiaire) {
      throw new NotFoundException("Stagiaire not found");
    }

    const stagiaireId = user.stagiaire.id;
    const participations = await this.participationRepository.find({
      where: { user_id: userId },
    });

    const totalQuizzes = participations.length;
    const completedQuizzes = participations.filter(
      (p) => p.status === "completed"
    ).length;
    const totalPoints = participations.reduce(
      (sum, p) => sum + (p.score || 0),
      0
    );
    const totalTimeSpent = participations.reduce(
      (sum, p) => sum + (p.time_spent || 0),
      0
    );

    const globalRanking = await this.getGlobalRanking();
    const myRanking = globalRanking.find(
      (item) => item.stagiaire.id === stagiaireId.toString()
    );

    const quizStats = await this.getQuizStats(userId);

    return {
      stagiaire: {
        id: stagiaireId.toString(),
        prenom: user.stagiaire.prenom,
        image: user.image || null,
      },
      totalPoints: myRanking?.totalPoints || 0,
      quizCount: quizStats.totalQuizzes,
      averageScore: quizStats.averageScore,
      completedQuizzes: quizStats.totalQuizzes,
      totalTimeSpent: totalTimeSpent,
      rang: myRanking?.rang || globalRanking.length + 1,
      level: parseInt(myRanking?.level || "1"),
      categoryStats: quizStats.categoryStats,
      levelProgress: quizStats.levelProgress,
    };
  }

  async getStagiaireRewards(userId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
    });

    if (!stagiaire) {
      return {
        points: 0,
        completed_quizzes: 0,
        completed_challenges: 0,
        rank: 0,
      };
    }

    const progression = await this.progressionRepository.findOne({
      where: { stagiaire_id: stagiaire.id },
    });

    const completedQuizzes = await this.participationRepository.count({
      where: { user_id: userId, status: "completed" },
    });

    return {
      points: progression?.score || 0,
      completed_quizzes: completedQuizzes,
      completed_challenges: 0,
    };
  }

  async getStagiaireDetails(stagiaireId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id: stagiaireId },
      relations: [
        "user",
        "formateurs",
        "formateurs.user",
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.catalogue_formation",
        "classements",
        "classements.quiz",
      ],
    });

    if (!stagiaire) {
      throw new NotFoundException("Stagiaire not found");
    }

    const totalPoints = stagiaire.classements.reduce(
      (sum, c) => sum + (c.points || 0),
      0
    );
    const globalRanking = await this.getGlobalRanking();
    const myRanking = globalRanking.find(
      (item) => item.stagiaire.id === stagiaireId.toString()
    );

    const successPercentage =
      stagiaire.classements.length > 0
        ? (stagiaire.classements.filter((c) => (c.points || 0) > 0).length /
            stagiaire.classements.length) *
          100
        : 0;

    const quizStats = await this.getQuizStats(stagiaire.user_id);

    return {
      id: stagiaire.id,
      firstname: stagiaire.prenom,
      name: stagiaire.user?.name || "",
      avatar: stagiaire.user?.image || null,
      rang: myRanking?.rang || 999,
      totalPoints: totalPoints,
      formations: (stagiaire.stagiaire_catalogue_formations || []).map(
        (scf) => ({
          id: scf.catalogue_formation.id,
          titre: scf.catalogue_formation.titre,
        })
      ),
      formateurs: (stagiaire.formateurs || []).map((f) => ({
        id: f.id,
        prenom: f.prenom,
        nom: f.user?.name || "",
        image: f.user?.image || null,
      })),
      quizStats: {
        totalCompleted: stagiaire.classements.length,
        totalQuiz: stagiaire.classements.length,
        pourcentageReussite: successPercentage,
        level: this.calculateLevel(totalPoints),
        byLevel: quizStats.levelProgress,
        lastActivity: stagiaire.updated_at,
      },
    };
  }

  async getUserPoints(userId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
      relations: ["classements"],
    });

    if (!stagiaire) {
      throw new NotFoundException("Stagiaire not found");
    }

    const totalPoints = stagiaire.classements.reduce(
      (sum, c) => sum + (c.points || 0),
      0
    );

    const accessibleLevels = ["debutant"];
    if (totalPoints >= 50) accessibleLevels.push("intermediaire");
    if (totalPoints >= 100) accessibleLevels.push("expert");

    return {
      totalPoints,
      accessibleLevels,
    };
  }

  async getQuizHistory(userId: number) {
    // Progression table uses stagiaire_id, not user_id directly
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
    });

    if (!stagiaire) return [];

    const progressions = await this.progressionRepository.find({
      where: { stagiaire_id: stagiaire.id },
      relations: [
        "quiz",
        "quiz.formation",
        "quiz.questions",
        "quiz.questions.reponses",
      ],
      order: { created_at: "DESC" },
    });

    return progressions
      .filter((p) => p.quiz) // Filter out null quiz (deleted quizzes)
      .map((progression) => {
        const quiz = progression.quiz;
        const totalQuestions =
          progression.total_questions ||
          parseInt(quiz.nb_points_total || "0") ||
          0;

        const quizData = {
          id: quiz.id,
          titre: quiz.titre,
          description: quiz.description || "",
          duree: quiz.duree?.toString() || "30",
          niveau: quiz.niveau || "débutant",
          status: quiz.status || "actif",
          nb_points_total: quiz.nb_points_total?.toString() || "0",
          formation: quiz.formation
            ? {
                id: quiz.formation.id,
                titre: quiz.formation.titre,
                description: quiz.formation.description || "",
                duree: quiz.formation.duree?.toString() || "30",
                categorie: quiz.formation.categorie || "Général",
              }
            : null,
          questions: (quiz.questions || []).map((question) => ({
            id: question.id.toString(),
            quizId: quiz.id,
            text: question.text,
            type: question.type || "choix multiples",
            explication: question.explication,
            points: question.points?.toString() || "1",
            astuce: question.astuce,
            mediaUrl: question.media_url || null,
            answers: (question.reponses || []).map((reponse) => ({
              id: reponse.id.toString(),
              text: reponse.text || "",
              isCorrect: reponse.isCorrect ? 1 : 0,
              position: reponse.position,
              matchPair: reponse.match_pair,
              bankGroup: reponse.bank_group,
              flashcardBack: reponse.flashcardBack,
            })),
          })),
        };

        return {
          id: progression.id.toString(),
          quiz: quizData,
          score: progression.score,
          completedAt: progression.created_at?.toISOString(),
          timeSpent: progression.time_spent || 0,
          totalQuestions: totalQuestions,
          correctAnswers: progression.correct_answers || 0,
        };
      });
  }

  async getQuizStats(userId: number) {
    // Get stagiaire first
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
    });

    if (!stagiaire) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        totalPoints: 0,
        categoryStats: [],
        levelProgress: {
          débutant: { completed: 0, averageScore: null },
          intermédiaire: { completed: 0, averageScore: null },
          avancé: { completed: 0, averageScore: null },
        },
      };
    }

    // Use Classement table like Laravel for accurate stats
    const classements = await this.classementRepository.find({
      where: { stagiaire_id: stagiaire.id },
      relations: ["quiz", "quiz.formation"],
    });

    const totalQuizzes = classements.length;
    const totalPoints = classements.reduce(
      (sum, c) => sum + (c.points || 0),
      0
    );
    const averageScore = totalQuizzes > 0 ? totalPoints / totalQuizzes : 0;

    const categoryMap: {
      [key: string]: { count: number; totalScore: number };
    } = {};
    const levelProgress = {
      débutant: { completed: 0, totalScore: 0 },
      intermédiaire: { completed: 0, totalScore: 0 },
      avancé: { completed: 0, totalScore: 0 },
    };

    classements.forEach((c) => {
      const score = c.points || 0;

      // Category stats
      const category = c.quiz?.formation?.categorie || "Général";
      if (!categoryMap[category]) {
        categoryMap[category] = { count: 0, totalScore: 0 };
      }
      categoryMap[category].count++;
      categoryMap[category].totalScore += score;

      // Level progress
      const level = c.quiz?.niveau?.toLowerCase() || "débutant";
      if (level.includes("débutant") || level.includes("debutant")) {
        levelProgress.débutant.completed++;
        levelProgress.débutant.totalScore += score;
      } else if (
        level.includes("intermédiaire") ||
        level.includes("intermediaire")
      ) {
        levelProgress.intermédiaire.completed++;
        levelProgress.intermédiaire.totalScore += score;
      } else if (level.includes("expert") || level.includes("avancé")) {
        levelProgress.avancé.completed++;
        levelProgress.avancé.totalScore += score;
      }
    });

    const categoryStats = Object.keys(categoryMap).map((cat) => ({
      category: cat,
      quizCount: categoryMap[cat].count,
      averageScore:
        Math.round(
          (categoryMap[cat].totalScore / categoryMap[cat].count) * 100
        ) / 100,
    }));

    return {
      totalQuizzes,
      averageScore: Math.round(averageScore * 100) / 100,
      totalPoints,
      categoryStats,
      levelProgress: {
        débutant: {
          completed: levelProgress.débutant.completed,
          averageScore:
            levelProgress.débutant.completed > 0
              ? Math.round(
                  (levelProgress.débutant.totalScore /
                    levelProgress.débutant.completed) *
                    100
                ) / 100
              : null,
        },
        intermédiaire: {
          completed: levelProgress.intermédiaire.completed,
          averageScore:
            levelProgress.intermédiaire.completed > 0
              ? Math.round(
                  (levelProgress.intermédiaire.totalScore /
                    levelProgress.intermédiaire.completed) *
                    100
                ) / 100
              : null,
        },
        avancé: {
          completed: levelProgress.avancé.completed,
          averageScore:
            levelProgress.avancé.completed > 0
              ? Math.round(
                  (levelProgress.avancé.totalScore /
                    levelProgress.avancé.completed) *
                    100
                ) / 100
              : null,
        },
      },
    };
  }

  async getCategoryStats(userId: number) {
    const stats = await this.getQuizStats(userId);
    return (stats.categoryStats || []).map((cat) => ({
      ...cat,
      completedQuizzes: cat.quizCount,
      totalQuizzes: cat.quizCount, // Simplified for now
      completionRate: 100, // Simplified for now
    }));
  }

  async getProgressStats(userId: number) {
    const participations = await this.participationRepository.find({
      where: { user_id: userId, status: "completed" },
      order: { completed_at: "ASC" },
    });

    const daily = participations.reduce((acc, p) => {
      const date = p.completed_at?.toISOString().split("T")[0];
      if (!date) return acc;
      if (!acc[date])
        acc[date] = { date, completed_quizzes: 0, total_points: 0 };
      acc[date].completed_quizzes++;
      acc[date].total_points += p.score || 0;
      return acc;
    }, {});

    return {
      daily_progress: Object.values(daily).map((d: any) => ({
        ...d,
        average_points: d.total_points / d.completed_quizzes,
      })),
      weekly_progress: [],
      monthly_progress: [],
    };
  }

  calculateLevel(points: number): string {
    const basePoints = 10;
    const maxLevel = 100;
    let level = "1";

    for (let l = 0; l <= maxLevel; l++) {
      const threshold = (l - 1) * basePoints;
      if (points >= threshold) {
        level = l.toString();
      } else {
        break;
      }
    }

    return level;
  }

  private groupBy(array: any[], key: string) {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  }
}
