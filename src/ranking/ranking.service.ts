import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { Classement } from "../entities/classement.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { Progression } from "../entities/progression.entity";
import { Quiz } from "../entities/quiz.entity";
import { User } from "../entities/user.entity";

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
    private userRepository: Repository<User>
  ) {}

  async getGlobalRanking() {
    const allClassements = await this.classementRepository.find({
      relations: ["stagiaire", "stagiaire.user", "quiz"],
    });

    const groupedByStagiaire = this.groupBy(allClassements, "stagiaire_id");

    const ranking = Object.keys(groupedByStagiaire).map((stagiaireId) => {
      const group = groupedByStagiaire[stagiaireId];
      const totalPoints = group.reduce(
        (sum, item) => sum + (item.points || 0),
        0
      );
      const first = group[0];
      const stagiaire = first.stagiaire;

      return {
        stagiaire: {
          id: stagiaire.id.toString(),
          prenom: stagiaire.prenom,
          image: stagiaire.user?.image || null,
        },
        totalPoints,
        quizCount: group.length,
        averageScore: totalPoints / group.length,
      };
    });

    ranking.sort((a, b) => b.totalPoints - a.totalPoints);

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
        level: "1",
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
        "stagiaire.formateur",
        "stagiaire.formateur.user",
        "stagiaire.commercial",
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

  async getStagiaireRewards(stagiaireId: number) {
    const progression = await this.progressionRepository.findOne({
      where: { stagiaire_id: stagiaireId },
    });

    const completedQuizzes = await this.participationRepository.count({
      where: { user_id: stagiaireId, status: "completed" }, // Note: stagiaireId != userId in some systems, check this
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
    const participations = await this.participationRepository.find({
      where: { user_id: userId, status: "completed" },
      relations: ["quiz", "quiz.formation"],
      order: { completed_at: "DESC" },
    });

    return participations.map((p) => {
      const totalQuestions = parseInt(p.quiz?.nb_points_total || "0") || 10;
      const correctAnswers = p.correct_answers || p.score || 0;

      return {
        id: p.id.toString(),
        quizId: p.quiz_id.toString(),
        quiz: {
          titre: p.quiz?.titre,
          title: p.quiz?.titre,
          category: p.quiz?.formation?.categorie,
          totalPoints: totalQuestions,
          level: p.quiz?.niveau,
          formation: p.quiz?.formation,
        },
        score: p.score,
        completedAt: p.completed_at || p.created_at,
        timeSpent: p.time_spent || 0,
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswers,
      };
    });
  }

  async getQuizStats(userId: number) {
    const participations = await this.participationRepository.find({
      where: { user_id: userId, status: "completed" },
      relations: ["quiz", "quiz.formation"],
    });

    const totalQuizzes = participations.length;
    let totalPoints = 0;
    const categoryMap: {
      [key: string]: { count: number; totalScore: number };
    } = {};
    const levelProgress = {
      débutant: { completed: 0, totalScore: 0 },
      intermédiaire: { completed: 0, totalScore: 0 },
      avancé: { completed: 0, totalScore: 0 },
    };

    participations.forEach((p) => {
      const score = p.score || 0;
      totalPoints += score;

      // Category stats
      const category = p.quiz?.formation?.categorie || "Général";
      if (!categoryMap[category]) {
        categoryMap[category] = { count: 0, totalScore: 0 };
      }
      categoryMap[category].count++;
      categoryMap[category].totalScore += score;

      // Level progress
      const level = p.quiz?.niveau?.toLowerCase() || "débutant";
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

    const averageScore = totalQuizzes > 0 ? totalPoints / totalQuizzes : 0;

    const categoryStats = Object.keys(categoryMap).map((cat) => ({
      category: cat,
      quizCount: categoryMap[cat].count,
      averageScore: categoryMap[cat].totalScore / categoryMap[cat].count,
    }));

    const formatLevelProgress = (levelData: {
      completed: number;
      totalScore: number;
    }) => ({
      completed: levelData.completed,
      averageScore:
        levelData.completed > 0
          ? levelData.totalScore / levelData.completed
          : null,
    });

    return {
      totalQuizzes,
      averageScore,
      totalPoints,
      categoryStats,
      levelProgress: {
        débutant: formatLevelProgress(levelProgress.débutant),
        intermédiaire: formatLevelProgress(levelProgress.intermédiaire),
        avancé: formatLevelProgress(levelProgress.avancé),
      },
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
