import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan, In } from "typeorm";
import { Classement } from "../entities/classement.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { Progression } from "../entities/progression.entity";
import { Quiz } from "../entities/quiz.entity";
import { User } from "../entities/user.entity";
import { Formation } from "../entities/formation.entity";
import { Question } from "../entities/question.entity";
import { Reponse } from "../entities/reponse.entity";
import * as fs from "fs";
import * as path from "path";

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
    private formationRepository: Repository<Formation>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Reponse)
    private reponseRepository: Repository<Reponse>,
  ) {}

  async getFormationsRankingSummary(period: string = "all") {
    const formations = await this.formationRepository.find({
      order: { id: "ASC" },
    });

    const summary = [];

    for (const formation of formations) {
      let query = this.classementRepository
        .createQueryBuilder("c")
        .leftJoinAndSelect("c.stagiaire", "stagiaire")
        .leftJoinAndSelect("stagiaire.user", "user")
        .where(
          "c.quiz_id IN (SELECT id FROM quizzes WHERE formation_id = :formationId)",
          { formationId: formation.id },
        );

      // Apply period filter
      if (period === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.andWhere("c.updated_at >= :weekAgo", { weekAgo });
      } else if (period === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.andWhere("c.updated_at >= :monthAgo", { monthAgo });
      } else if (period === "quarter" || period === "trimestre") {
        const quarterAgo = new Date();
        quarterAgo.setMonth(quarterAgo.getMonth() - 3);
        query = query.andWhere("c.updated_at >= :quarterAgo", { quarterAgo });
      }

      const classements = await query.getMany();

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

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    formationId?: number,
  ) {
    const query = this.classementRepository
      .createQueryBuilder("c")
      .leftJoinAndSelect("c.quiz", "quiz");

    if (formationId) {
      query.where("quiz.formation_id = :formationId", { formationId });
    }

    query
      .orderBy("c.id", "ASC")
      .take(limit)
      .skip((page - 1) * limit);

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }

  async getGlobalRanking(
    period: string = "all",
    quarter?: string,
    formationId?: number,
  ) {
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

    // Apply formation filter if provided
    if (formationId) {
      query = query.andWhere(
        "quiz.formation_id = COALESCE((SELECT formation_id FROM catalogue_formations WHERE id = :fic), :fic)",
        { fic: formationId },
      );
    }

    // Apply period filter if needed
    if (period === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.where("c.updated_at >= :weekAgo", { weekAgo });
    } else if (period === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.where("c.updated_at >= :monthAgo", { monthAgo });
    } else if (period === "quarter" || period === "trimestre") {
      const quarterAgo = new Date();
      quarterAgo.setMonth(quarterAgo.getMonth() - 3);
      query = query.where("c.updated_at >= :quarterAgo", { quarterAgo });
    } else if (period === "all" && quarter && quarter !== "all") {
      // Handle special case where period is all but a specific quarter is requested
      const year = new Date().getFullYear();
      let startMonth = 0;
      let endMonth = 2; // Q1 by default

      if (quarter === "1") {
        startMonth = 0;
        endMonth = 2;
      } else if (quarter === "2") {
        startMonth = 3;
        endMonth = 5;
      } else if (quarter === "3") {
        startMonth = 6;
        endMonth = 8;
      } else if (quarter === "4") {
        startMonth = 9;
        endMonth = 11;
      }

      const qStart = new Date(year, startMonth, 1);
      const qEnd = new Date(year, endMonth + 1, 0, 23, 59, 59);

      query = query
        .where("c.updated_at >= :qStart", { qStart })
        .andWhere("c.updated_at <= :qEnd", { qEnd });
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
          0,
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
          (f) => f.formations && f.formations.length > 0,
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
      (item) => item.stagiaire.id === stagiaire.id.toString(),
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

  async getFormationRanking(formationId: number, period: string = "all") {
    // Laravel uses progressions for formation ranking
    let query = this.progressionRepository
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.stagiaire", "stagiaire")
      .leftJoinAndSelect("stagiaire.user", "user")
      .where("p.formation_id = :formationId", { formationId });

    // Apply period filter
    if (period === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.andWhere("p.updated_at >= :weekAgo", { weekAgo });
    } else if (period === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.andWhere("p.updated_at >= :monthAgo", { monthAgo });
    } else if (period === "quarter" || period === "trimestre") {
      const quarterAgo = new Date();
      quarterAgo.setMonth(quarterAgo.getMonth() - 3);
      query = query.andWhere("p.updated_at >= :quarterAgo", { quarterAgo });
    }

    const progressions = await query.orderBy("p.score", "DESC").getMany();

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
      return {
        stagiaire: null,
        totalPoints: 0,
        quizCount: 0,
        averageScore: 0,
        completedQuizzes: 0,
        totalTimeSpent: 0,
        rang: 0,
        level: 1,
        categoryStats: [],
        levelProgress: {},
      };
    }

    const stagiaireId = user.stagiaire.id;
    const participations = await this.participationRepository.find({
      where: { user_id: userId },
    });

    const totalQuizzes = participations.length;
    const completedQuizzes = participations.filter(
      (p) => p.status === "completed",
    ).length;
    const totalPoints = participations.reduce(
      (sum, p) => sum + (p.score || 0),
      0,
    );
    const totalTimeSpent = participations.reduce(
      (sum, p) => sum + (p.time_spent || 0),
      0,
    );

    const globalRanking = await this.getGlobalRanking();
    const myRanking = globalRanking.find(
      (item) => item.stagiaire.id === stagiaireId.toString(),
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
      0,
    );
    const globalRanking = await this.getGlobalRanking();
    const myRanking = globalRanking.find(
      (item) => item.stagiaire.id === stagiaireId.toString(),
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
        }),
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
      0,
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
    const logPath = path.join(process.cwd(), "debug_ranking.txt");
    const log = (msg: string) =>
      fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);

    log(`Starting getQuizHistory for userId: ${userId}`);

    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
      relations: [
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.catalogue_formation",
        "stagiaire_catalogue_formations.catalogue_formation.formation",
      ],
    });

    if (!stagiaire) {
      log(`Stagiaire not found for userId: ${userId}`);
      return [];
    }

    const formationIds =
      stagiaire.stagiaire_catalogue_formations
        ?.map((scf) => scf.catalogue_formation?.formation?.id)
        .filter((id) => id !== undefined) || [];

    log(`formationIds: ${JSON.stringify(formationIds)}`);

    if (formationIds.length === 0) {
      log(`No formations found for stagiaire ${stagiaire.id}`);
      return [];
    }

    const quizzes = await this.quizRepository.find({
      where: {
        formation_id: In(formationIds),
        status: "actif",
      },
      relations: ["formation"],
    });

    log(`quizzes found: ${quizzes.length}`);

    if (quizzes.length === 0) return [];

    const quizIds = quizzes.map((q) => q.id);
    log(`quizIds: ${JSON.stringify(quizIds)}`);

    // Fetch ALL questions for these quizzes with reponses in a single optimized query
    const allQuestions = await this.questionRepository.find({
      where: { quiz_id: In(quizIds) },
      relations: ["reponses"],
      order: { id: "ASC" },
    });

    log(`allQuestions found: ${allQuestions.length}`);

    // Map questions by quiz_id
    const questionsByQuizId: { [key: number]: Question[] } = {};
    allQuestions.forEach((q) => {
      if (!questionsByQuizId[q.quiz_id]) {
        questionsByQuizId[q.quiz_id] = [];
      }
      questionsByQuizId[q.quiz_id].push(q);
    });

    // Fetch participations
    const participations = await this.participationRepository.find({
      where: {
        user_id: userId,
        quiz_id: In(quizIds),
      },
      order: { created_at: "DESC" },
    });

    log(`participations found: ${participations.length}`);

    const participationsByQuizId: { [key: number]: QuizParticipation } = {};
    participations.forEach((p) => {
      if (!participationsByQuizId[p.quiz_id]) {
        participationsByQuizId[p.quiz_id] = p;
      }
    });

    return quizzes.map((quiz) => {
      const lastParticipation = participationsByQuizId[quiz.id];
      const quizQuestions = questionsByQuizId[quiz.id] || [];

      return {
        id: quiz.id.toString(),
        titre: quiz.titre,
        description: quiz.description,
        duree: quiz.duree ?? "30",
        niveau: quiz.niveau ?? "débutant",
        status: quiz.status ?? "actif",
        nb_points_total: String(quiz.nb_points_total || "0"),
        formationId: quiz.formation?.id ? quiz.formation.id.toString() : null,
        categorie: quiz.formation?.categorie ?? null,
        formation: quiz.formation
          ? {
              id: quiz.formation.id,
              titre: quiz.formation.titre ?? null,
              categorie: quiz.formation.categorie ?? null,
            }
          : null,
        questions: quizQuestions.map((question) => ({
          id: question.id.toString(),
          text: question.text ?? null,
          type: question.type ?? "choix multiples",
          points: parseInt(question.points || "0") || 0, // Match Laravel's (int) cast for questions list
          answers: (question.reponses || []).map((r) => ({
            id: r.id.toString(),
            text: r.text,
            isCorrect: Boolean(r.isCorrect ?? false),
          })),
        })),
        userParticipation: lastParticipation
          ? {
              id: lastParticipation.id,
              status: lastParticipation.status || "completed",
              score: lastParticipation.score,
              correct_answers: lastParticipation.correct_answers,
              time_spent: lastParticipation.time_spent,
              started_at: lastParticipation.started_at?.toISOString() || null,
              completed_at:
                lastParticipation.completed_at?.toISOString() || null,
            }
          : null,
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
      0,
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
          (categoryMap[cat].totalScore / categoryMap[cat].count) * 100,
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
                    100,
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
                    100,
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
                    100,
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
        currentValue,
      );
      return result;
    }, {});
  }
}
