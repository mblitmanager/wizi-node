import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, LessThan, In } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { User } from "../entities/user.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { Formateur } from "../entities/formateur.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(QuizParticipation)
    private quizParticipationRepository: Repository<QuizParticipation>,
    @InjectRepository(Formateur)
    private formateurRepository: Repository<Formateur>,
    @InjectRepository(CatalogueFormation)
    private formationRepository: Repository<CatalogueFormation>
  ) {}

  async getFormateurDashboardStats(userId: number) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
      relations: ["stagiaires", "stagiaires.user"],
    });

    if (!formateur) return null;

    const stagiaires = formateur.stagiaires;
    const totalStagiaires = stagiaires.length;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const activeThisWeek = stagiaires.filter(
      (s) => s.user?.last_activity_at && s.user.last_activity_at > weekAgo
    ).length;

    const neverConnected = stagiaires.filter(
      (s) => !s.user?.last_login_at
    ).length;
    const inactiveCount = totalStagiaires - activeThisWeek;

    const userIds = stagiaires
      .map((s) => s.user_id)
      .filter((id) => id !== null);

    let avgScore = 0;
    if (userIds.length > 0) {
      const participations = await this.quizParticipationRepository.find({
        where: { user_id: In(userIds) },
      });
      if (participations.length > 0) {
        avgScore =
          participations.reduce((acc, p) => acc + (p.score || 0), 0) /
          participations.length;
      }
    }

    // Aggregated stats for formations
    const formationsQuery = this.formationRepository
      .createQueryBuilder("cf")
      .leftJoin("cf.stagiaire_catalogue_formations", "scf")
      .leftJoin("scf.stagiaire", "s")
      .leftJoin("s.user", "u")
      .leftJoin(QuizParticipation, "qp", "u.id = qp.user_id")
      .select([
        "cf.id AS id",
        "cf.titre AS nom",
        "COUNT(DISTINCT s.id) AS total_stagiaires",
        "COUNT(DISTINCT CASE WHEN u.last_activity_at >= :weekAgo THEN s.id END) AS stagiaires_actifs",
        "COALESCE(AVG(qp.score), 0) AS score_moyen",
      ])
      .setParameter("weekAgo", weekAgo)
      .groupBy("cf.id")
      .addGroupBy("cf.titre")
      .orderBy("total_stagiaires", "DESC")
      .limit(10); // Page 1, limit 10

    const formationsRaw = await formationsQuery.getRawMany();

    // Aggregated stats for formateurs
    const formateursQuery = this.formateurRepository
      .createQueryBuilder("f")
      .innerJoin("f.user", "u")
      .leftJoin("f.stagiaires", "s")
      .select([
        "f.id AS id",
        "f.prenom AS prenom",
        "u.name AS nom",
        "COUNT(DISTINCT s.id) AS total_stagiaires",
      ])
      .groupBy("f.id")
      .addGroupBy("f.prenom")
      .addGroupBy("u.name")
      .orderBy("total_stagiaires", "DESC")
      .limit(5); // Page 1, limit 5

    const formateursRaw = await formateursQuery.getRawMany();

    const totalCatalogFormations = await this.formationRepository.count();
    const totalFormateursCount = await this.formateurRepository.count();

    const distinctFormationsResult = await this.formationRepository
      .createQueryBuilder("cf")
      .innerJoin("cf.stagiaire_catalogue_formations", "scf")
      .innerJoin("scf.stagiaire", "s")
      .innerJoin("s.formateurs", "f", "f.id = :formateurId", {
        formateurId: formateur.id,
      })
      .select("COUNT(DISTINCT cf.id)", "cnt")
      .getRawOne();

    const totalFormations = parseInt(distinctFormationsResult.cnt);

    // Calculate total quizzes taken by formateur's stagiaires
    let totalQuizzesTaken = 0;
    if (userIds.length > 0) {
      totalQuizzesTaken = await this.quizParticipationRepository.count({
        where: { user_id: In(userIds) },
      });
    }

    return {
      total_stagiaires: totalStagiaires,
      active_this_week: activeThisWeek,
      inactive_count: inactiveCount,
      never_connected: neverConnected,
      avg_quiz_score: parseFloat(avgScore.toFixed(1)),
      total_formations: totalFormations,
      total_quizzes_taken: totalQuizzesTaken,
      total_video_hours: 0,
      formations: {
        data: formationsRaw.map((f) => ({
          id: f.id,
          nom: f.nom,
          total_stagiaires: parseInt(f.total_stagiaires),
          stagiaires_actifs: parseInt(f.stagiaires_actifs),
          score_moyen: parseFloat(f.score_moyen).toFixed(4),
        })),
        current_page: 1,
        first_page_url:
          "http://127.0.0.1:3000/api/formateur/dashboard/stats?page=1",
        from: 1,
        last_page: Math.ceil(totalCatalogFormations / 10),
        last_page_url: `http://127.0.0.1:3000/api/formateur/dashboard/stats?page=${Math.ceil(totalCatalogFormations / 10)}`,
        links: [],
        next_page_url:
          totalCatalogFormations > 10
            ? "http://127.0.0.1:3000/api/formateur/dashboard/stats?page=2"
            : null,
        path: "http://127.0.0.1:3000/api/formateur/dashboard/stats",
        per_page: 10,
        prev_page_url: null,
        to: formationsRaw.length,
        total: totalCatalogFormations,
      },
      formateurs: {
        data: formateursRaw.map((f) => ({
          id: f.id,
          prenom: f.prenom,
          nom: f.nom,
          total_stagiaires: parseInt(f.total_stagiaires),
        })),
        current_page: 1,
        first_page_url:
          "http://127.0.0.1:3000/api/formateur/dashboard/stats?page=1",
        from: 1,
        last_page: Math.ceil(totalFormateursCount / 5),
        last_page_url: `http://127.0.0.1:3000/api/formateur/dashboard/stats?page=${Math.ceil(totalFormateursCount / 5)}`,
        links: [],
        next_page_url:
          totalFormateursCount > 5
            ? "http://127.0.0.1:3000/api/formateur/dashboard/stats?page=2"
            : null,
        path: "http://127.0.0.1:3000/api/formateur/dashboard/stats",
        per_page: 5,
        prev_page_url: null,
        to: formateursRaw.length,
        total: totalFormateursCount,
      },
    };
  }

  async getFormateurStagiairesPerformance(userId: number) {
    console.log(
      "getFormateurStagiairesPerformance called with userId:",
      userId
    );

    // 1. Get Formateur ID first (Mirroring Laravel: Formateur::where('user_id', $user->id)->first())
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
    });

    if (!formateur) {
      console.log("Formateur not found for userId:", userId);
      return {
        performance: [],
        rankings: { most_quizzes: [], most_active: [] },
      };
    }

    const formateurId = formateur.id;
    console.log("Found Formateur ID:", formateurId);

    // 2. Query Stagiaires filtered by Formateur ID
    // Laravel: join users, join formateur_stagiaire where formateur_id = $id
    const qb = this.stagiaireRepository
      .createQueryBuilder("s")
      .innerJoin("s.user", "u") // Ensure stagiaire has a user
      .innerJoin("s.formateurs", "f") // Join table
      .where("f.id = :formateurId", { formateurId })
      .select([
        "s.id",
        "s.prenom",
        "s.login_streak",
        "u.id",
        "u.name",
        "u.email",
        "u.image",
      ]);

    // Debug generated SQL
    console.log("Stagiaire Performance SQL:", qb.getSql());

    const stagiaires = await qb.getMany();

    console.log(
      `Found ${stagiaires.length} stagiaires for formateur ${formateurId}`
    );

    if (stagiaires.length === 0) {
      return {
        performance: [],
        rankings: { most_quizzes: [], most_active: [] },
      };
    }

    const userIds = stagiaires.map((s) => s.user.id);

    // 3. Aggregate quiz stats
    let quizStats = new Map<number, { count: number; last_at: Date | null }>();

    if (userIds.length > 0) {
      const stats = await this.quizParticipationRepository
        .createQueryBuilder("qp")
        .select("qp.user_id", "user_id")
        .addSelect("COUNT(qp.id)", "count")
        .addSelect("MAX(qp.created_at)", "last_at")
        .where("qp.user_id IN (:...userIds)", { userIds })
        //.andWhere("qp.status = 'completed'") // Uncomment if strictly needed, but getting any activity is safer for now
        .groupBy("qp.user_id")
        .getRawMany();

      stats.forEach((stat) => {
        quizStats.set(stat.user_id, {
          count: parseInt(stat.count),
          last_at: stat.last_at ? new Date(stat.last_at) : null,
        });
      });
    }

    // 4. Map final data
    const performance = stagiaires.map((s) => {
      const stats = quizStats.get(s.user.id) || {
        count: 0,
        last_at: null,
      };

      return {
        id: s.id, // Stagiaire ID as per Laravel response
        // Laravel response: "id": 11 (This is Stagiaire ID, but note Laravel query does 'stagiaires.id')
        // Laravel mapped name: "{$student->prenom} {$student->nom}"
        name: s.user.name || `${s.prenom}`,
        email: s.user.email,
        image: s.user.image || null,
        last_quiz_at: stats.last_at
          ? new Date(stats.last_at.getTime() + 3 * 60 * 60 * 1000) // UTC+3
              .toISOString()
              .replace("T", " ")
              .substring(0, 19)
          : null,
        total_quizzes: stats.count,
        total_logins: s.login_streak || 0,
      };
    });

    // Rankings
    const mostQuizzes = [...performance]
      .sort((a, b) => b.total_quizzes - a.total_quizzes)
      .slice(0, 5);

    const mostActive = [...performance]
      .sort((a, b) => b.total_logins - a.total_logins)
      .slice(0, 5);

    return {
      performance,
      rankings: {
        most_quizzes: mostQuizzes,
        most_active: mostActive,
      },
    };
  }

  async getFormateurInactiveStagiaires(
    userId: number,
    days: number = 7,
    scope: string = "all"
  ) {
    const thresholdDays = days;
    // Debug: Check total stagiaires in DB
    const totalStagiaires = await this.stagiaireRepository.count();
    console.log(`[DEBUG] Total Stagiaires in DB: ${totalStagiaires}`);

    const now = new Date();
    const weekAgo = new Date(
      now.getTime() - thresholdDays * 24 * 60 * 60 * 1000
    );

    // 1. Get Formateur ID
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
    });

    if (!formateur) {
      return {
        inactive_stagiaires: [],
        count: 0,
        threshold_days: thresholdDays,
      };
    }

    const formateurId = formateur.id;

    // 2. Fetch stagiaires
    const query = this.stagiaireRepository
      .createQueryBuilder("s")
      .innerJoin("s.user", "u");

    if (scope !== "all") {
      query
        .innerJoin("s.formateurs", "f")
        .where("f.id = :formateurId", { formateurId });
    }

    const stagiaires = await query
      .select([
        "s.id",
        "s.prenom",
        "s.user_id", // Needed for mapping
        "u.name",
        "u.email",
        "u.last_activity_at",
        "u.last_client",
      ])
      .getMany();

    // 3. Filter and Format
    const inactiveStagiaires = stagiaires
      .map((s) => {
        const lastActivityAt = s.user?.last_activity_at
          ? new Date(s.user.last_activity_at)
          : null;

        let daysSinceActivity: number | null = null;
        if (lastActivityAt) {
          const diffTime = Math.abs(now.getTime() - lastActivityAt.getTime());
          daysSinceActivity = diffTime / (1000 * 60 * 60 * 24);
        }

        return {
          id: s.id,
          prenom: s.prenom,
          nom: s.user?.name, // Assuming name field holds surname or full name
          email: s.user?.email,
          last_activity_at: lastActivityAt
            ? lastActivityAt.toISOString().replace("T", " ").substring(0, 19)
            : null,
          days_since_activity: daysSinceActivity,
          never_connected: !lastActivityAt,
          last_client: s.user?.last_client || null,
        };
      })
      .filter(
        (s) =>
          s.never_connected ||
          (s.days_since_activity && s.days_since_activity > thresholdDays)
      );

    return {
      inactive_stagiaires: inactiveStagiaires,
      count: inactiveStagiaires.length,
      threshold_days: thresholdDays,
    };
  }

  async getFormateurStagiaires() {
    console.log("[DEBUG] AdminService: Fetching stagiaires...");
    const stagiaires = await this.stagiaireRepository.find({
      relations: ["user"],
    });
    console.log(
      `[DEBUG] AdminService: Found ${stagiaires.length} stagiaires in DB`
    );

    return stagiaires.map((s) => {
      const formatDate = (date: Date | null) => {
        if (!date) return null;
        // Simple YYYY-MM-DD HH:mm:ss format
        return new Date(date).toISOString().replace("T", " ").substring(0, 19);
      };

      return {
        id: s.id,
        prenom: s.prenom,
        nom: s.user?.name || "",
        email: s.user?.email || "",
        telephone: s.telephone,
        ville: s.ville,
        last_login_at: formatDate(s.user?.last_login_at),
        last_activity_at: formatDate(s.user?.last_activity_at),
        is_online: s.user?.is_online ? 1 : 0,
        last_client: s.user?.last_client || null,
        image: s.user?.image || null,
      };
    });
  }

  async getOnlineStagiaires() {
    const stagiaires = await this.stagiaireRepository.find({
      where: { user: { is_online: true } },
      relations: [
        "user",
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.catalogue_formation",
      ],
    });

    return stagiaires.map((s) => {
      const formatDate = (date: Date | null) => {
        if (!date) return null;
        return new Date(date).toISOString().replace("T", " ").substring(0, 19);
      };

      return {
        id: s.id,
        prenom: s.prenom,
        nom: s.user?.name || "",
        email: s.user?.email || "",
        avatar: s.user?.image || null,
        last_activity_at: formatDate(s.user?.last_activity_at),
        formations: (s.stagiaire_catalogue_formations || []).map(
          (scf) => scf.catalogue_formation?.titre
        ),
      };
    });
  }

  async getNeverConnected() {
    const stagiaires = await this.stagiaireRepository.find({
      where: { user: { last_login_at: null } },
      relations: ["user"],
    });

    return stagiaires.map((s) => ({
      id: s.id,
      prenom: s.prenom,
      nom: s.user?.name || "",
      email: s.user?.email || "",
      last_activity_at: null,
    }));
  }

  async getStagiaireStats(id: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!stagiaire) return null;

    const quizStatsRaw = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .leftJoin("qp.quiz", "q")
      .leftJoin("q.questions", "ques")
      .where("qp.user_id = :userId", { userId: stagiaire.user_id })
      .select([
        "COUNT(DISTINCT qp.id) as total_quiz",
        "AVG(qp.score) as avg_score",
        "MAX(qp.score) as best_score",
        "SUM(qp.correct_answers) as total_correct",
        "COUNT(ques.id) as total_questions", // Note: This might be tricky with joins, but let's try
      ])
      .getRawOne();

    const formatDate = (date: Date | null) => {
      if (!date) return null;
      return new Date(date).toISOString().replace("T", " ").substring(0, 19);
    };

    return {
      stagiaire: {
        id: stagiaire.id,
        prenom: stagiaire.prenom,
        nom: stagiaire.user?.name ?? "N/A",
        email: stagiaire.user?.email ?? "N/A",
      },
      quiz_stats: {
        total_quiz: parseInt(quizStatsRaw.total_quiz) || 0,
        avg_score: parseFloat(quizStatsRaw.avg_score) || 0,
        best_score: parseInt(quizStatsRaw.best_score) || 0,
        total_correct: parseInt(quizStatsRaw.total_correct) || 0,
        total_questions: parseInt(quizStatsRaw.total_questions) || 0,
      },
      activity: {
        last_activity: stagiaire.user?.last_activity_at
          ? "Récemment"
          : "Jamais", // Placeholder for diffForHumans
        last_login: formatDate(stagiaire.user?.last_login_at),
        is_online: stagiaire.user?.is_online || false,
        last_client: stagiaire.user?.last_client,
      },
    };
  }
}
