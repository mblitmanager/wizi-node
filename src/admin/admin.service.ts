import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, LessThan, In } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { User } from "../entities/user.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { Formateur } from "../entities/formateur.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Classement } from "../entities/classement.entity";
import { NotificationService } from "../notification/notification.service";
import { Formation } from "../entities/formation.entity";
import { Media } from "../entities/media.entity";
import { MediaStagiaire } from "../entities/media-stagiaire.entity";
import { StagiaireCatalogueFormation } from "../entities/stagiaire-catalogue-formation.entity";
import { Quiz } from "../entities/quiz.entity";
import { DemandeInscription } from "../entities/demande-inscription.entity";
import { Parrainage } from "../entities/parrainage.entity";
import { LoginHistory } from "../entities/login-history.entity";
import { MailService } from "../mail/mail.service";

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
    private catalogueFormationRepository: Repository<CatalogueFormation>,
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(MediaStagiaire)
    private mediaStagiaireRepository: Repository<MediaStagiaire>,
    @InjectRepository(StagiaireCatalogueFormation)
    private stagiaireCatalogueFormationRepository: Repository<StagiaireCatalogueFormation>,
    @InjectRepository(Classement)
    private classementRepository: Repository<Classement>,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(DemandeInscription)
    private demandeInscriptionRepository: Repository<DemandeInscription>,
    @InjectRepository(Parrainage)
    private parrainageRepository: Repository<Parrainage>,
    @InjectRepository(LoginHistory)
    private loginHistoryRepository: Repository<LoginHistory>,
    private notificationService: NotificationService,
    private mailService: MailService,
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
      (s) => s.user?.last_activity_at && s.user.last_activity_at > weekAgo,
    ).length;

    const neverConnected = stagiaires.filter(
      (s) => !s.user?.last_login_at,
    ).length;
    const inactiveCount = totalStagiaires - activeThisWeek;

    const userIds = stagiaires
      .map((s) => s.user_id)
      .filter((id) => id !== null);

    let avgScore = 0;
    let totalQuizzesTaken = 0;
    if (userIds.length > 0) {
      // Correction: Utiliser le meilleur score par quiz pour la moyenne (Parité Laravel)
      const bestScores = await this.classementRepository
        .createQueryBuilder("c")
        .innerJoin("c.stagiaire", "s")
        .where("s.user_id IN (:...userIds)", { userIds })
        .select("c.quiz_id", "quiz_id")
        .addSelect("MAX(c.points)", "best_points")
        .groupBy("s.user_id")
        .addGroupBy("c.quiz_id")
        .getRawMany();

      if (bestScores.length > 0) {
        avgScore =
          bestScores.reduce(
            (acc, c) => acc + (parseInt(c.best_points) || 0),
            0,
          ) / bestScores.length;
        totalQuizzesTaken = bestScores.length;
      }
    }

    // Aggregated stats for formations
    const formationsQuery = this.catalogueFormationRepository
      .createQueryBuilder("cf")
      .innerJoin("cf.formateurs", "f", "f.id = :formateurId", {
        formateurId: formateur.id,
      })
      .leftJoin("cf.stagiaire_catalogue_formations", "scf")
      .leftJoin("scf.stagiaire", "s")
      .leftJoin("s.user", "u")
      .leftJoin(Classement, "c", "s.id = c.stagiaire_id")
      .select([
        "cf.id AS id",
        "cf.titre AS nom",
        "COUNT(DISTINCT s.id) AS total_stagiaires",
        "COUNT(DISTINCT CASE WHEN u.last_activity_at >= :weekAgo THEN s.id END) AS stagiaires_actifs",
        "COALESCE(AVG(c.points), 0) AS score_moyen",
      ])
      .setParameter("weekAgo", weekAgo)
      .groupBy("cf.id")
      .addGroupBy("cf.titre")
      .orderBy("total_stagiaires", "DESC")
      .limit(10);

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

    const totalCatalogFormations =
      await this.catalogueFormationRepository.count();
    const totalFormateursCount = await this.formateurRepository.count();

    const distinctFormationsResult = await this.catalogueFormationRepository
      .createQueryBuilder("cf")
      .innerJoin("cf.stagiaire_catalogue_formations", "scf")
      .innerJoin("scf.stagiaire", "s")
      .innerJoin("s.formateurs", "f", "f.id = :formateurId", {
        formateurId: formateur.id,
      })
      .select("COUNT(DISTINCT cf.id)", "cnt")
      .getRawOne();

    const totalFormations = parseInt(distinctFormationsResult.cnt);

    // totalQuizzesTaken already calculated using Classement

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
          title: f.nom,
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
      userId,
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
      `Found ${stagiaires.length} stagiaires for formateur ${formateurId}`,
    );

    if (stagiaires.length === 0) {
      return {
        performance: [],
        rankings: { most_quizzes: [], most_active: [] },
      };
    }

    const userIds = stagiaires.map((s) => s.user.id);

    // 3. Aggregate quiz stats using Classement table (best scores)
    let quizStats = new Map<number, { count: number; last_at: Date | null }>();

    if (userIds.length > 0) {
      const stats = await this.classementRepository
        .createQueryBuilder("c")
        .innerJoin("c.stagiaire", "s")
        .select("s.user_id", "user_id")
        .addSelect("COUNT(c.id)", "count")
        .addSelect("MAX(c.updated_at)", "last_at")
        .where("s.user_id IN (:...userIds)", { userIds })
        .groupBy("s.user_id")
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
        prenom: s.prenom,
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
    scope: string = "all",
  ) {
    const thresholdDays = days;
    // Debug: Check total stagiaires in DB
    const totalStagiaires = await this.stagiaireRepository.count();
    console.log(`[DEBUG] Total Stagiaires in DB: ${totalStagiaires}`);

    const now = new Date();
    const weekAgo = new Date(
      now.getTime() - thresholdDays * 24 * 60 * 60 * 1000,
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
      .innerJoinAndSelect("s.user", "u");

    if (scope !== "all") {
      // Get IDs of students linked directly OR via formations
      const directStagiaireIds = await this.stagiaireRepository
        .createQueryBuilder("s")
        .innerJoin("s.formateurs", "f")
        .where("f.id = :formateurId", { formateurId })
        .select("s.id")
        .getMany()
        .then((list) => list.map((item) => item.id));

      const formationStagiaireIds = await this.stagiaireRepository
        .createQueryBuilder("s")
        .innerJoin("s.stagiaire_catalogue_formations", "scf")
        .innerJoin("scf.catalogue_formation", "cf")
        .innerJoin("cf.formateurs", "f")
        .where("f.id = :formateurId", { formateurId })
        .select("s.id")
        .getMany()
        .then((list) => list.map((item) => item.id));

      const allMyStagiaireIds = [
        ...new Set([...directStagiaireIds]), // Strict parity: Direct students only
        // ...new Set([...directStagiaireIds, ...formationStagiaireIds]),
      ];

      console.log(
        `[DEBUG] Formateur ${formateurId}: Direct Students: ${directStagiaireIds.length}, Formation Students: ${formationStagiaireIds.length}, Total Unique: ${allMyStagiaireIds.length}`,
      );
      console.log(`[DEBUG] IDs: ${JSON.stringify(allMyStagiaireIds)}`);

      if (allMyStagiaireIds.length > 0) {
        query.andWhere("s.id IN (:...allMyStagiaireIds)", {
          allMyStagiaireIds,
        });
      } else {
        console.log("[DEBUG] No students found, returning empty object.");
        // If no students linked at all, return empty results early
        return {
          inactive_stagiaires: [],
          count: 0,
          threshold_days: thresholdDays,
        };
      }
    }

    const stagiaires = await query.getMany();
    console.log(
      `[DEBUG] Found ${stagiaires.length} potential stagiaires for scope ${scope}`,
    );

    // 3. Filter and Format
    const inactiveStagiaires = stagiaires
      .map((s) => {
        // Use the most recent of last_activity_at or last_login_at
        const timestamps = [
          s.user?.last_activity_at
            ? new Date(s.user.last_activity_at).getTime()
            : 0,
          s.user?.last_login_at ? new Date(s.user.last_login_at).getTime() : 0,
        ].filter((t) => t > 0);

        const lastActiveTime =
          timestamps.length > 0 ? Math.max(...timestamps) : null;
        const lastActivityAt = lastActiveTime ? new Date(lastActiveTime) : null;

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
          (s.days_since_activity && s.days_since_activity > thresholdDays),
      );

    return {
      inactive_stagiaires: inactiveStagiaires,
      count: inactiveStagiaires.length,
      threshold_days: thresholdDays,
    };
  }

  async getOnlineStagiaires() {
    const stagiaires = await this.stagiaireRepository
      .createQueryBuilder("stagiaire")
      .innerJoinAndSelect("stagiaire.user", "user")
      .leftJoinAndSelect("stagiaire.stagiaire_catalogue_formations", "scf")
      .leftJoinAndSelect("scf.catalogue_formation", "cf")
      .where("user.is_online = :isOnline", { isOnline: true })
      .getMany();

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
          (scf) => scf.catalogue_formation?.titre,
        ),
      };
    });
  }

  async getFormateurOnlineStagiaires(userId: number) {
    try {
      // First get the formateur
      const formateur = await this.formateurRepository.findOne({
        where: { user_id: userId },
      });

      if (!formateur) {
        console.log("Formateur not found for userId:", userId);
        return [];
      }

      console.log("Found formateur:", formateur.id);

      // Query all stagiaires that belong to this formateur and are online
      const stagiaires = await this.stagiaireRepository
        .createQueryBuilder("stagiaire")
        .innerJoinAndSelect("stagiaire.user", "user")
        .leftJoinAndSelect("stagiaire.stagiaire_catalogue_formations", "scf")
        .leftJoinAndSelect("scf.catalogue_formation", "cf")
        .innerJoin(
          "stagiaire.formateurs",
          "formateur",
          "formateur.id = :formateurId",
          { formateurId: formateur.id },
        )
        .where("user.is_online = :isOnline", { isOnline: true })
        .orderBy("stagiaire.prenom", "ASC")
        .getMany();

      console.log("Found online stagiaires:", stagiaires.length);

      return stagiaires.map((s) => {
        const formatDate = (date: Date | null) => {
          if (!date) return null;
          return new Date(date)
            .toISOString()
            .replace("T", " ")
            .substring(0, 19);
        };

        return {
          id: s.id,
          prenom: s.prenom,
          nom: s.user?.name || "",
          email: s.user?.email || "",
          avatar: s.user?.image || null,
          last_activity_at: formatDate(s.user?.last_activity_at),
          formations: (s.stagiaire_catalogue_formations || []).map(
            (scf) => scf.catalogue_formation?.titre,
          ),
        };
      });
    } catch (error) {
      console.error("Error fetching formateur online stagiaires:", error);
      return [];
    }
  }

  async getFormateurStagiaires(userId: number) {
    // Get formateur
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
    });

    if (!formateur) {
      return [];
    }

    // Query all stagiaires that belong to this formateur (not just online)
    const stagiaires = await this.stagiaireRepository
      .createQueryBuilder("stagiaire")
      .innerJoinAndSelect("stagiaire.user", "user")
      .leftJoinAndSelect("stagiaire.stagiaire_catalogue_formations", "scf")
      .leftJoinAndSelect("scf.catalogue_formation", "cf")
      .innerJoin(
        "stagiaire.formateurs",
        "formateur",
        "formateur.id = :formateurId",
        { formateurId: formateur.id },
      )
      .orderBy("stagiaire.prenom", "ASC")
      .getMany();

    return stagiaires.map((s) => ({
      id: s.id,
      prenom: s.prenom,
      nom: s.user?.name || "",
      email: s.user?.email || "",
      avatar: s.user?.image || null,
      last_activity_at: s.user?.last_activity_at
        ? new Date(s.user.last_activity_at)
            .toISOString()
            .replace("T", " ")
            .substring(0, 19)
        : null,
      formations: (s.stagiaire_catalogue_formations || []).map(
        (scf) => scf.catalogue_formation?.titre,
      ),
    }));
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

  async getStagiaireProfileById(id: number) {
    try {
      const stagiaire = await this.stagiaireRepository.findOne({
        where: { id },
        relations: [
          "user",
          "stagiaire_catalogue_formations",
          "stagiaire_catalogue_formations.catalogue_formation",
          "stagiaire_catalogue_formations.catalogue_formation.formation",
          "formateurs",
          "formateurs.user",
          "commercials",
          "commercials.user",
          "poleRelationClients",
          "poleRelationClients.user",
          "partenaire",
        ],
      });

      if (!stagiaire) {
        console.warn(`[AdminService] Stagiaire not found for ID: ${id}`);
        return null;
      }

      // Safe access to user_id
      const userId =
        stagiaire.user_id || (stagiaire.user ? stagiaire.user.id : null);

      let quizStatsRaw: any = {};

      let totalPoints = 0;
      let totalQuizzes = 0;
      let averageScore = 0;

      if (userId && stagiaire.id) {
        try {
          const classements = await this.classementRepository.find({
            where: { stagiaire_id: stagiaire.id },
          });

          totalQuizzes = classements.length;
          totalPoints = classements.reduce(
            (sum, c) => sum + (c.points || 0),
            0,
          );
          averageScore =
            totalQuizzes > 0
              ? Math.round((totalPoints / totalQuizzes) * 10) / 10
              : 0;
        } catch (qError) {
          console.error(
            `[AdminService] Error fetching quiz stats for stagiaire ${stagiaire.id}:`,
            qError,
          );
        }
      }

      quizStatsRaw = {
        total_quiz: totalQuizzes,
        best_score: totalPoints,
        avg_score: averageScore,
      };

      const formatDate = (date: Date | null | undefined) => {
        if (!date) return null;
        try {
          return new Date(date)
            .toISOString()
            .replace("T", " ")
            .substring(0, 19);
        } catch (e) {
          return null;
        }
      };

      const quizHistoryRaw = userId
        ? await this.quizParticipationRepository.find({
            where: { user_id: userId },
            relations: ["quiz", "quiz.formation", "quiz.questions"],
            order: { created_at: "DESC" },
            take: 10,
          })
        : [];

      const loginHistoryRaw = userId
        ? await this.loginHistoryRepository.find({
            where: { user_id: userId },
            order: { login_at: "DESC" },
            take: 10,
          })
        : [];

      return {
        stagiaire: {
          id: stagiaire.id,
          prenom: stagiaire.prenom,
          nom: stagiaire.user?.name ?? "N/A",
          email: stagiaire.user?.email ?? "N/A",
          avatar: stagiaire.user?.image || null,
          civilite: stagiaire.civilite || "M.",
          telephone: stagiaire.telephone,
          date_inscription: stagiaire.date_inscription,
          date_debut_formation: stagiaire.date_debut_formation,
          last_login: stagiaire.user?.last_login_at,
        },
        contacts: {
          formateurs: (stagiaire.formateurs || []).map((f) => ({
            id: f.id,
            prenom: f.prenom,
            nom: f.user?.name || "Formateur",
            telephone: f.telephone,
            email: f.user?.email,
            role: f.role || "Formateur",
            image: f.user?.image,
            civilite: f.civilite,
          })),
          pole_relation: (stagiaire.poleRelationClients || []).map((p) => ({
            id: p.id,
            prenom: p.prenom,
            nom: p.user?.name || "Relation Client",
            telephone: p.telephone,
            role: p.role || "Relation Client",
            email: p.user?.email,
            image: p.user?.image,
            civilite: (p as any).civilite || "M.",
          })),
          commercials: (stagiaire.commercials || []).map((c) => ({
            id: c.id,
            prenom: c.prenom,
            nom: c.user?.name || "Conseiller",
            telephone: c.telephone,
            email: c.user?.email,
            role: c.role || "Conseiller",
            image: c.user?.image,
            civilite: c.civilite,
          })),
          partenaire: stagiaire.partenaire
            ? {
                id: stagiaire.partenaire.id,
                nom: (stagiaire.partenaire as any).identifiant || "Partenaire",
                email: (stagiaire.partenaire as any).email || null,
                telephone: (stagiaire.partenaire as any).telephone || null,
              }
            : null,
        },
        stats: {
          total_points: parseInt(quizStatsRaw?.best_score) || 0,
          current_badge: "BRONZE",
          formations_completed: 0,
          formations_in_progress:
            stagiaire.stagiaire_catalogue_formations?.length || 0,
          quizzes_completed: parseInt(quizStatsRaw?.total_quiz) || 0,
          average_score: Math.round(parseFloat(quizStatsRaw?.avg_score) || 0),
          total_time_minutes: 0,
          login_streak: stagiaire.login_streak || 0,
        },
        quiz_history: quizHistoryRaw.map((qp) => {
          const totalQuestions = qp.quiz?.questions?.length || 0;
          const correctAnswers = qp.correct_answers || 0;
          return {
            id: qp.id,
            quiz_id: qp.quiz_id,
            correctAnswers: correctAnswers,
            totalQuestions: totalQuestions,
            score: qp.score,
            percentage:
              totalQuestions > 0
                ? Math.round((correctAnswers / totalQuestions) * 100)
                : qp.score,
            completedAt: qp.created_at,
            timeSpent: qp.time_spent || 0,
            quiz: {
              id: qp.quiz?.id,
              titre: qp.quiz?.titre,
              niveau: qp.quiz?.niveau,
              formation: {
                categorie: qp.quiz?.formation?.categorie,
              },
            },
          };
        }),
        login_history: loginHistoryRaw.map((lh) => ({
          id: lh.id,
          ip_address: lh.ip_address,
          device: lh.device,
          browser: lh.browser,
          platform: lh.platform,
          login_at: lh.login_at,
        })),
        activity: {
          last_activity: stagiaire.user?.last_activity_at
            ? "Récemment"
            : "Jamais",
          last_login: formatDate(stagiaire.user?.last_login_at),
          is_online: stagiaire.user?.is_online || false,
          last_client: stagiaire.user?.last_client,
        },
        formations: await this.getStagiaireFormationPerformance(stagiaire.id),
        video_stats: {
          total_watched: 0,
          total_time_watched: 0,
        },
      };
    } catch (error) {
      console.error(
        `[AdminService] Error in getStagiaireProfileById(${id}):`,
        error,
      );
      throw error; // Rethrow to let controller handle or 500, but now logged
    }
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

  async getFormateurMesStagiairesRanking(
    userId: number,
    period: string = "all",
  ) {
    // 1. Get Formateur
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
    });

    if (!formateur) {
      return { ranking: [], total_stagiaires: 0, period };
    }

    const formateurId = formateur.id;

    // 2. Setup period filters
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // 3. Query using Classement table (same source as global ranking)
    const queryBuilder = this.classementRepository
      .createQueryBuilder("c")
      .innerJoin("c.stagiaire", "s")
      .innerJoin("s.user", "u")
      .innerJoin("s.formateurs", "f", "f.id = :formateurId", { formateurId });

    // Apply period filter
    if (period === "week") {
      queryBuilder.andWhere("c.updated_at >= :weekAgo", { weekAgo });
    } else if (period === "month") {
      queryBuilder.andWhere("c.updated_at >= :monthAgo", { monthAgo });
    }

    const rawRanking = await queryBuilder
      .select([
        "s.id as id",
        "s.prenom as prenom",
        "u.name as nom",
        "u.email as email",
        "u.image as image",
        "COALESCE(SUM(c.points), 0) as total_points",
        "COUNT(DISTINCT c.quiz_id) as total_quiz",
        "COALESCE(AVG(c.points), 0) as avg_score",
      ])
      .groupBy("s.id")
      .addGroupBy("s.prenom")
      .addGroupBy("u.name")
      .addGroupBy("u.email")
      .addGroupBy("u.image")
      .orderBy("total_points", "DESC")
      .getRawMany();

    const ranking = rawRanking.map((item, index) => ({
      rank: index + 1,
      id: parseInt(item.id),
      prenom: item.prenom,
      nom: item.nom,
      email: item.email,
      image: item.image,
      total_points: parseInt(item.total_points),
      total_quiz: parseInt(item.total_quiz),
      avg_score: parseFloat(parseFloat(item.avg_score).toFixed(1)),
    }));

    return {
      ranking,
      total_stagiaires: ranking.length,
    };
  }

  async getTrainerArenaRanking(period: string = "all", formationId?: number) {
    // 1. Get all trainers
    const trainers = await this.formateurRepository.find({
      relations: ["user"],
    });

    const result = [];

    // Setup period filters
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    for (const f of trainers) {
      // Query using Classement table (same source as global ranking)
      const stagiairesQuery = this.classementRepository
        .createQueryBuilder("c")
        .innerJoin("c.stagiaire", "s")
        .innerJoin("s.user", "su")
        .innerJoin("s.formateurs", "form", "form.id = :formateurId", {
          formateurId: f.id,
        });

      // Apply formation filter if provided
      if (formationId) {
        stagiairesQuery
          .innerJoin("c.quiz", "q")
          .andWhere(
            "q.formation_id = COALESCE((SELECT formation_id FROM catalogue_formations WHERE id = :cid), :cid)",
            { cid: formationId },
          );
      }

      // Apply period filter
      if (period === "week") {
        stagiairesQuery.andWhere("c.updated_at >= :weekAgo", { weekAgo });
      } else if (period === "month") {
        stagiairesQuery.andWhere("c.updated_at >= :monthAgo", { monthAgo });
      }

      stagiairesQuery
        .select([
          "s.id AS id",
          "s.prenom AS prenom",
          "su.name AS nom",
          "su.image AS image",
          "COALESCE(SUM(c.points), 0) AS points",
        ])
        .groupBy("s.id")
        .addGroupBy("s.prenom")
        .addGroupBy("su.name")
        .addGroupBy("su.image")
        .orderBy("points", "DESC");

      const stagiairesRaw = await stagiairesQuery.getRawMany();
      const stagiaires = stagiairesRaw.map((s) => ({
        ...s,
        id: parseInt(s.id),
        points: parseInt(s.points),
      }));

      const totalPoints = stagiaires.reduce((acc, s) => acc + s.points, 0);

      result.push({
        id: f.id,
        prenom: f.prenom,
        nom: f.user?.name || "",
        image: f.user?.image,
        total_stagiaires: stagiaires.length,
        total_points: totalPoints,
        stagiaires,
      });
    }

    return result.sort((a, b) => b.total_points - a.total_points);
  }

  async getFormateurFormations(userId: number) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
      relations: ["stagiaires"],
    });

    if (!formateur) return [];

    const stagiaireUserIds = formateur.stagiaires
      .map((s) => s.user_id)
      .filter((id) => id != null);

    const formations = await this.catalogueFormationRepository
      .createQueryBuilder("cf")
      .leftJoin("cf.formateurs", "f_direct") // Direct link
      .leftJoin("cf.stagiaire_catalogue_formations", "scf_any") // Via students link
      .leftJoin("scf_any.stagiaire", "s_any")
      .leftJoin("s_any.formateurs", "f_indirect")
      .where("(f_direct.id = :formateurId OR f_indirect.id = :formateurId)", {
        formateurId: formateur.id,
      })
      .leftJoin("cf.formation", "real_formation") // Join the content definition
      .leftJoin("cf.stagiaire_catalogue_formations", "scf")
      .select([
        "cf.id as id",
        "cf.titre as titre",
        "cf.titre as nom",
        "cf.image_url as image_url",
        "cf.tarif as tarif",
        "real_formation.id as formation_id", // EXPOSE FORMATION ID
        "real_formation.titre as formation_titre",
        "COUNT(DISTINCT scf.stagiaire_id) as student_count",
      ])
      .groupBy("cf.id")
      .addGroupBy("real_formation.id") // Group by real formation too
      .addGroupBy("real_formation.titre")
      .addGroupBy("cf.titre")
      .addGroupBy("cf.image_url")
      .addGroupBy("cf.tarif")
      .getRawMany();

    // Enrich with quiz analytics
    const enrichedFormations = await Promise.all(
      formations.map(async (f) => {
        let analytics = { avg_score: 0, total_completions: 0 };

        if (stagiaireUserIds.length > 0) {
          // Note: Here we filter by 'formationId: f.id'. f.id is 'CatalogueFormation' ID.
          // But Quiz links to 'Formation' (f.formation_id).
          // THIS WAS A BUG. We should filter by f.formation_id if we want quiz stats.
          // IF the quizzes are linked to the *content* (Formation), we must use f.formation_id.

          const targetFormationId = f.formation_id; // Using the real formation ID for quiz stats

          if (targetFormationId) {
            const stats = await this.quizParticipationRepository
              .createQueryBuilder("qp")
              .innerJoin("qp.quiz", "q")
              .where("q.formation_id = :formationId", {
                formationId: targetFormationId,
              }) // Fixed to use real formation ID
              .andWhere("qp.user_id IN (:...userIds)", {
                userIds: stagiaireUserIds,
              })
              .andWhere("qp.status = :status", { status: "completed" })
              .select([
                "AVG(qp.score) as avg_score",
                "COUNT(qp.id) as total_completions",
              ])
              .getRawOne();

            analytics = {
              avg_score:
                Math.round((parseFloat(stats.avg_score) || 0) * 10) / 10,
              total_completions: parseInt(stats.total_completions) || 0,
            };
          }
        }

        return {
          id: parseInt(f.id),
          titre: f.titre,
          image_url: f.image_url,
          tarif: f.tarif,
          formation_id: f.formation_id ? parseInt(f.formation_id) : null, // Return it
          formation_titre: f.formation_titre,
          student_count: parseInt(f.student_count),
          ...analytics,
        };
      }),
    );

    return enrichedFormations;
  }

  async getFormateurAvailableFormations() {
    const formations = await this.catalogueFormationRepository.find({
      where: { statut: 1 },
      relations: ["formation"],
      order: { titre: "ASC" },
    });

    return formations.map((f) => ({
      id: f.id,
      titre: f.titre,
      description: f.description,
      duree: f.duree,
      image_url: f.image_url,
      tarif: f.tarif,
      categorie: f.formation?.categorie || "Général",
      formation_id: f.formation_id,
    }));
  }

  async getFormationStats(catalogueFormationId: number, userId: number) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
      relations: ["stagiaires"],
    });

    if (!formateur) return null;

    const catalogueFormation = await this.catalogueFormationRepository.findOne({
      where: { id: catalogueFormationId },
      relations: ["formation"],
    });

    if (!catalogueFormation) return null;

    const stagiaires = await this.stagiaireRepository
      .createQueryBuilder("s")
      .innerJoin("s.formateurs", "f", "f.id = :formateurId", {
        formateurId: formateur.id,
      })
      .innerJoin(
        "s.stagiaire_catalogue_formations",
        "scf",
        "scf.catalogue_formation_id = :cfid",
        { cfid: catalogueFormationId },
      )
      .select("s.user_id")
      .getMany();

    const userIds = stagiaires.map((s) => s.user_id).filter((id) => id != null);

    let stats = {
      student_count: userIds.length,
      avg_score: 0,
      total_completions: 0,
    };

    if (userIds.length > 0 && catalogueFormation.formation_id) {
      const qpStats = await this.quizParticipationRepository
        .createQueryBuilder("qp")
        .innerJoin("qp.quiz", "q")
        .where("q.formation_id = :fid", {
          fid: catalogueFormation.formation_id,
        })
        .andWhere("qp.user_id IN (:...uids)", { uids: userIds })
        .andWhere("qp.status = :status", { status: "completed" })
        .select([
          "AVG(qp.score) as avg_score",
          "COUNT(qp.id) as total_completions",
        ])
        .getRawOne();

      stats.avg_score =
        Math.round((parseFloat(qpStats.avg_score) || 0) * 10) / 10;
      stats.total_completions = parseInt(qpStats.total_completions) || 0;
    }

    return {
      id: catalogueFormation.id,
      titre: catalogueFormation.titre,
      ...stats,
    };
  }

  async getUnassignedStagiaires(catalogueFormationId: number, userId: number) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
      relations: ["stagiaires", "stagiaires.user"],
    });

    if (!formateur) return [];

    // Get IDs of students already in this formation
    const assignedStagiaires = await this.stagiaireCatalogueFormationRepository
      .createQueryBuilder("scf")
      .where("scf.catalogue_formation_id = :cfid", {
        cfid: catalogueFormationId,
      })
      .select("scf.stagiaire_id")
      .getMany();

    const assignedIds = assignedStagiaires.map((s) => s.stagiaire_id);

    // Filter formateur's students
    return (formateur.stagiaires || [])
      .filter((s) => !assignedIds.includes(s.id))
      .map((s) => ({
        id: s.id,
        prenom: s.prenom,
        nom: s.user?.name || "",
        email: s.user?.email || "",
      }));
  }

  async getStagiaireFormationPerformance(id: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id },
      relations: [
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.catalogue_formation",
        "stagiaire_catalogue_formations.catalogue_formation.formation",
      ],
    });

    if (!stagiaire) return [];

    const performance = await Promise.all(
      stagiaire.stagiaire_catalogue_formations.map(async (scf) => {
        const formation = scf.catalogue_formation?.formation;
        if (!formation) return null;

        // Group by level
        const levelStatsRaw = await this.quizParticipationRepository
          .createQueryBuilder("qp")
          .innerJoin("qp.quiz", "q")
          .where("q.formation_id = :formationId", { formationId: formation.id })
          .andWhere("qp.user_id = :userId", { userId: stagiaire.user_id })
          .andWhere("qp.status = :status", { status: "completed" })
          .select([
            "q.niveau as level",
            "AVG(qp.score) as avg_score",
            "MAX(qp.score) as best_score",
            "COUNT(qp.id) as completions",
          ])
          .groupBy("q.niveau")
          .getRawMany();

        const levels = levelStatsRaw.map((ls) => ({
          name:
            ls.level?.charAt(0).toUpperCase() +
              ls.level?.slice(1).toLowerCase() || "Non défini",
          avg_score: Math.round((parseFloat(ls.avg_score) || 0) * 10) / 10,
          best_score: parseInt(ls.best_score) || 0,
          completions: parseInt(ls.completions) || 0,
        }));

        const totalAvg =
          levels.length > 0
            ? Math.round(
                (levels.reduce((acc, l) => acc + l.avg_score, 0) /
                  levels.length) *
                  10,
              ) / 10
            : 0;
        const totalCompletions = levels.reduce(
          (acc, l) => acc + l.completions,
          0,
        );
        const bestScore =
          levels.length > 0 ? Math.max(...levels.map((l) => l.best_score)) : 0;

        return {
          id: formation.id,
          title: formation.titre,
          titre: formation.titre,
          image_url: formation.image,
          category: formation.categorie || "Général",
          progress: 0,
          avg_score: totalAvg,
          best_score: bestScore,
          completions: totalCompletions,
          levels,
          last_activity: null,
          completed_at: null,
        };
      }),
    );

    return performance.filter((p) => p !== null);
  }

  async getFormateurTrends(userId: number) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
      relations: ["stagiaires"],
    });

    if (!formateur) return { quiz_trends: [], activity_trends: [] };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userIds = formateur.stagiaires
      .map((s) => s.user_id)
      .filter((id) => id !== null);

    if (userIds.length === 0) return { quiz_trends: [], activity_trends: [] };

    // Mirroring Laravel: quiz trends
    const quizTrends = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .where("qp.user_id IN (:...userIds)", { userIds })
      .andWhere("qp.created_at >= :thirtyDaysAgo", { thirtyDaysAgo })
      .select([
        "DATE(qp.created_at) as date",
        "COUNT(*) as count",
        "AVG(qp.score) as avg_score",
      ])
      .groupBy("date")
      .orderBy("date")
      .getRawMany();

    // Mirroring Laravel: activity trends (using quiz participation as a proxy if login_histories doesn't exist in Node entities)
    // Actually, let's check if we have a way to track activity.
    // If not, we'll return empty activity trends for now or use quiz activity.
    const activityTrends = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .where("qp.user_id IN (:...userIds)", { userIds })
      .andWhere("qp.created_at >= :thirtyDaysAgo", { thirtyDaysAgo })
      .select([
        "DATE(qp.created_at) as date",
        "COUNT(DISTINCT qp.user_id) as count",
      ])
      .groupBy("date")
      .orderBy("date")
      .getRawMany();

    return {
      quiz_trends: quizTrends.map((t) => ({
        date: t.date,
        count: parseInt(t.count),
        avg_score: parseFloat(parseFloat(t.avg_score || 0).toFixed(1)),
      })),
      activity_trends: activityTrends.map((t) => ({
        date: t.date,
        count: parseInt(t.count),
      })),
    };
  }

  async getCommercialDashboardStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalSignups = await this.stagiaireRepository.count();
    const signupsThisMonth = await this.stagiaireRepository.count({
      where: { created_at: Between(monthStart, now) },
    });

    const activeStudents = await this.userRepository.count({
      where: { last_activity_at: Between(thirtyDaysAgo, now) },
    });

    const conversionRate =
      totalSignups > 0 ? (activeStudents / totalSignups) * 100 : 0;

    const recentSignups = await this.stagiaireRepository.find({
      relations: ["user"],
      order: { created_at: "DESC" },
      take: 10,
    });

    const topFormations = await this.formationRepository
      .createQueryBuilder("cf")
      .loadRelationCountAndMap(
        "cf.enrollments",
        "cf.stagiaire_catalogue_formations",
      )
      .orderBy("cf.enrollments", "DESC") // This might be tricky with virtual fields, let's use raw query style if needed
      .limit(5)
      .getMany();

    // Since we need real counts to sort, let's use a raw query or better grouping
    const topFormationsQuery = await this.formationRepository
      .createQueryBuilder("cf")
      .leftJoin("cf.stagiaire_catalogue_formations", "scf")
      .select([
        "cf.id as id",
        "cf.titre as name",
        "COUNT(scf.id) as enrollments",
        "cf.tarif as price",
      ])
      .groupBy("cf.id")
      .orderBy("enrollments", "DESC")
      .limit(5)
      .getRawMany();

    const signupTrends = await this.stagiaireRepository
      .createQueryBuilder("s")
      .where("s.created_at >= :thirtyDaysAgo", { thirtyDaysAgo })
      .select(["DATE(s.created_at) as date", "COUNT(*) as value"])
      .groupBy("date")
      .orderBy("date")
      .getRawMany();

    return {
      summary: {
        totalSignups,
        signupsThisMonth,
        activeStudents,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
      },
      recentSignups: recentSignups.map((s) => ({
        id: s.id,
        name: s.user?.name || "Unknown",
        email: s.user?.email || "",
        role: s.user?.role || "stagiaire",
        created_at: s.created_at
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
      })),
      topFormations: topFormationsQuery.map((f) => ({
        id: parseInt(f.id),
        name: f.name,
        enrollments: parseInt(f.enrollments),
        price: parseFloat(f.price || 0),
      })),
      signupTrends: signupTrends.map((t) => ({
        date: t.date,
        value: parseInt(t.value),
      })),
    };
  }

  async disconnectStagiaires(stagiaireIds: number[]) {
    // 1. Get user_ids of the stagiaires
    const stagiaires = await this.stagiaireRepository.find({
      where: { id: In(stagiaireIds) },
      select: ["id", "user_id"],
    });

    const userIds = stagiaires
      .map((s) => s.user_id)
      .filter((id) => id !== null);

    if (userIds.length === 0) {
      return 0;
    }

    // 2. Update is_online to 0 for those users
    const result = await this.userRepository.update(
      { id: In(userIds) },
      { is_online: false },
    );

    return result.affected || 0;
  }

  async sendNotification(
    senderId: number,
    recipientIds: number[],
    title: string,
    message: string,
  ) {
    console.log(
      `[DEBUG] AdminService: Sending notification to ${recipientIds.length} recipients...`,
    );

    const promises = recipientIds.map(async (id) => {
      // Find the user_id associated with this stagiaire id
      const stagiaire = await this.stagiaireRepository.findOne({
        where: { id },
        select: ["id", "user_id"],
      });

      if (stagiaire && stagiaire.user_id) {
        return this.notificationService.createNotification(
          stagiaire.user_id,
          "system",
          message,
          { type: "custom", sender_id: senderId },
          title,
        );
      }
    });

    await Promise.all(promises);
    return { success: true, count: recipientIds.length };
  }

  async getMyStagiairesRanking(userId: number, period: string = "all") {
    return this.getFormateurMesStagiairesRanking(userId, period);
  }

  async getRankingByFormation(
    catalogueFormationId: number,
    period: string = "all",
  ) {
    // 1. Get all quizzes linked to this CatalogueFormation
    const cf = await this.catalogueFormationRepository.findOne({
      where: { id: catalogueFormationId },
    });

    if (!cf || !cf.formation_id) return [];

    const quizzes = await this.quizRepository.find({
      where: { formation_id: cf.formation_id },
      select: ["id"],
    });

    const quizIds = quizzes.map((q) => q.id);
    if (quizIds.length === 0) return [];

    // 2. Get ranking from Classement filtered by these quizzes
    const qb = this.classementRepository
      .createQueryBuilder("c")
      .innerJoin("c.stagiaire", "s")
      .innerJoin("s.user", "u")
      .select([
        "s.id as id",
        "s.prenom as prenom",
        "u.name as nom",
        "u.email as email",
        "SUM(c.points) as total_points",
        "COUNT(c.id) as total_quiz",
        "AVG(c.points) as avg_score",
      ])

      .where("c.quiz_id IN (:...quizIds)", { quizIds });

    // Note: We're ignoring 'period' for now to keep it consistent with Formation scope
    // But could add .andWhere("c.updated_at >= ...") if needed

    const ranking = await qb
      .groupBy("s.id")
      .addGroupBy("s.prenom")
      .addGroupBy("u.name")
      .addGroupBy("u.email")
      .orderBy("total_points", "DESC")
      .getRawMany();

    return ranking.map((r, index) => ({
      rank: index + 1,
      id: parseInt(r.id),
      prenom: r.prenom,
      nom: r.nom,
      email: r.email,
      total_points: parseInt(r.total_points),
      total_quiz: parseInt(r.total_quiz),
      avg_score: Math.round(parseFloat(r.avg_score)),
    }));
  }

  async getFormateurAnalyticsDashboard(
    userId: number,
    period: number = 30,
    formationId?: number,
  ) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
      relations: ["stagiaires"],
    });

    if (!formateur) return null;

    let stagiaireIds = formateur.stagiaires.map((s: any) => s.id);

    if (formationId) {
      // Filter stagiaires that are in this specific formation
      const formationStagiaires = await this.stagiaireRepository
        .createQueryBuilder("s")
        .innerJoin("s.stagiaire_catalogue_formations", "scf")
        .where("scf.catalogue_formation_id = :formationId", { formationId })
        .andWhere("s.id IN (:...ids)", { ids: stagiaireIds })
        .select("s.id")
        .getMany();

      stagiaireIds = formationStagiaires.map((s) => s.id);
    }

    if (stagiaireIds.length === 0) {
      return {
        period_days: period,
        summary: {
          total_stagiaires: 0,
          active_stagiaires: 0,
          total_completions: 0,
          average_score: 0,
          trend_percentage: 0,
        },
      };
    }

    // Active stagiaires (last 7 days)
    const activeStagiaires = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .select("DISTINCT qp.stagiaire_id")
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")
      .getRawMany();

    // Total completions (current period)
    const totalCompletionsQuery = this.quizParticipationRepository
      .createQueryBuilder("qp")
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .andWhere("qp.status = :status", { status: "completed" })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
        days: period,
      });

    if (formationId) {
      totalCompletionsQuery.andWhere(
        "qp.quiz_id IN (SELECT id FROM quizzes WHERE formation_id = (SELECT formation_id FROM catalogue_formations WHERE id = :cid))",
        { cid: formationId },
      );
    }

    const totalCompletions = await totalCompletionsQuery.getCount();

    // Average score
    const avgScoreQuery = this.quizParticipationRepository
      .createQueryBuilder("qp")
      .select("AVG(qp.score)", "avg_score")
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .andWhere("qp.status = :status", { status: "completed" })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
        days: period,
      });

    if (formationId) {
      avgScoreQuery.andWhere(
        "qp.quiz_id IN (SELECT id FROM quizzes WHERE formation_id = (SELECT formation_id FROM catalogue_formations WHERE id = :cid))",
        { cid: formationId },
      );
    }

    const avgScoreResult = await avgScoreQuery.getRawOne();

    // Previous period completions for trend
    const previousCompletionsQuery = this.quizParticipationRepository
      .createQueryBuilder("qp")
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .andWhere("qp.status = :status", { status: "completed" })
      .andWhere(
        "qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY) AND qp.created_at < DATE_SUB(NOW(), INTERVAL :prevDays DAY)",
        { days: period * 2, prevDays: period },
      );

    if (formationId) {
      previousCompletionsQuery.andWhere(
        "qp.quiz_id IN (SELECT id FROM quizzes WHERE formation_id = (SELECT formation_id FROM catalogue_formations WHERE id = :cid))",
        { cid: formationId },
      );
    }

    const previousCompletions = await previousCompletionsQuery.getCount();

    const trend =
      previousCompletions > 0
        ? Math.round(
            ((totalCompletions - previousCompletions) / previousCompletions) *
              1000,
          ) / 10
        : 0;

    return {
      period_days: period,
      summary: {
        total_stagiaires: stagiaireIds.length,
        active_stagiaires: activeStagiaires.length,
        total_completions: totalCompletions,
        average_score: Math.round((avgScoreResult?.avg_score || 0) * 10) / 10,
        trend_percentage: trend,
      },
    };
  }

  async getFormateurQuizSuccessRate(
    userId: number,
    period: number = 30,
    formationId?: number,
  ) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
      relations: ["stagiaires"],
    });

    if (!formateur) return null;

    let stagiaireIds = formateur.stagiaires.map((s: any) => s.id);

    if (formationId) {
      const formationStagiaires = await this.stagiaireRepository
        .createQueryBuilder("s")
        .innerJoin("s.stagiaire_catalogue_formations", "scf")
        .where("scf.catalogue_formation_id = :formationId", { formationId })
        .andWhere("s.id IN (:...ids)", { ids: stagiaireIds })
        .select("s.id")
        .getMany();
      stagiaireIds = formationStagiaires.map((s) => s.id);
    }

    const stagiaires = await this.stagiaireRepository.find({
      where: { id: In(stagiaireIds) },
      select: ["id", "user_id"],
    });
    const userIds = stagiaires.map((s) => s.user_id).filter((id) => id != null);

    if (userIds.length === 0) {
      return { period_days: period, quiz_stats: [] };
    }

    const query = this.quizParticipationRepository
      .createQueryBuilder("qp")
      .leftJoinAndSelect("qp.quiz", "quiz")
      .leftJoinAndSelect("quiz.formation", "formation")
      .where("qp.user_id IN (:...ids)", { ids: userIds })
      .andWhere("qp.status = :status", { status: "completed" })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
        days: period,
      });

    if (formationId) {
      query.andWhere(
        "quiz.formation_id = COALESCE((SELECT formation_id FROM catalogue_formations WHERE id = :cid), :cid)",
        { cid: formationId },
      );
    }

    const participations = await query.getMany();

    const quizStatsMap = new Map();

    participations.forEach((p: any) => {
      if (!quizStatsMap.has(p.quiz_id)) {
        quizStatsMap.set(p.quiz_id, {
          quiz_id: p.quiz_id,
          quiz_name: p.quiz.titre,
          category: p.quiz.formation?.categorie || "Général",
          participations: [],
        });
      }
      quizStatsMap.get(p.quiz_id).participations.push(p);
    });

    const quizStats = Array.from(quizStatsMap.values()).map((stat) => {
      const total = stat.participations.length;
      const successful = stat.participations.filter((p: any) => {
        const maxScore = parseInt(p.quiz.nb_points_total) || 100;
        return p.score / maxScore >= 0.5;
      }).length;

      const avgScore =
        stat.participations.reduce((sum: number, p: any) => sum + p.score, 0) /
        total;

      return {
        quiz_id: stat.quiz_id,
        quiz_name: stat.quiz_name,
        category: stat.category,
        total_attempts: total,
        successful_attempts: successful,
        success_rate: Math.round((successful / total) * 1000) / 10,
        average_score: Math.round(avgScore * 10) / 10,
      };
    });

    return {
      period_days: period,
      quiz_stats: quizStats,
    };
  }

  async getFormateurActivityHeatmap(
    userId: number,
    period: number = 30,
    formationId?: number,
  ) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
      relations: ["stagiaires"],
    });

    if (!formateur) return null;

    let stagiaireIds = formateur.stagiaires.map((s: any) => s.id);

    if (formationId) {
      const formationStagiaires = await this.stagiaireRepository
        .createQueryBuilder("s")
        .innerJoin("s.stagiaire_catalogue_formations", "scf")
        .where("scf.catalogue_formation_id = :formationId", { formationId })
        .andWhere("s.id IN (:...ids)", { ids: stagiaireIds })
        .select("s.id")
        .getMany();
      stagiaireIds = formationStagiaires.map((s) => s.id);
    }

    const stagiaires = await this.stagiaireRepository.find({
      where: { id: In(stagiaireIds) },
      select: ["id", "user_id"],
    });
    const userIds = stagiaires.map((s) => s.user_id).filter((id) => id != null);

    if (userIds.length === 0) {
      return { period_days: period, activity_by_day: [], activity_by_hour: [] };
    }

    const query = this.quizParticipationRepository
      .createQueryBuilder("qp")
      .where("qp.user_id IN (:...ids)", { ids: userIds })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
        days: period,
      });

    if (formationId) {
      query.andWhere(
        "qp.quiz_id IN (SELECT id FROM quizzes WHERE formation_id = COALESCE((SELECT formation_id FROM catalogue_formations WHERE id = :cid), :cid))",
        { cid: formationId },
      );
    }

    const byDay = await query
      .clone()
      .select("DAYOFWEEK(qp.created_at)", "day_of_week")
      .addSelect("COUNT(*)", "activity_count")
      .groupBy("day_of_week")
      .orderBy("day_of_week", "ASC")
      .getRawMany();

    const daysLabel = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const activityByDay = byDay.map((bd) => ({
      day: daysLabel[bd.day_of_week - 1] || "Unknown",
      activity_count: parseInt(bd.activity_count),
    }));

    const byHour = await query
      .clone()
      .select("HOUR(qp.created_at)", "hour")
      .addSelect("COUNT(*)", "activity_count")
      .groupBy("hour")
      .orderBy("hour", "ASC")
      .getRawMany();

    const activityByHour = byHour.map((bh) => ({
      hour: parseInt(bh.hour),
      activity_count: parseInt(bh.activity_count),
    }));

    return {
      period_days: period,
      activity_by_day: activityByDay,
      activity_by_hour: activityByHour,
    };
  }

  async getFormateurDropoutRate(userId: number, formationId?: number) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
      relations: ["stagiaires"],
    });

    if (!formateur) return null;

    let stagiaireIds = formateur.stagiaires.map((s: any) => s.id);

    if (formationId) {
      const formationStagiaires = await this.stagiaireRepository
        .createQueryBuilder("s")
        .innerJoin("s.stagiaire_catalogue_formations", "scf")
        .where("scf.catalogue_formation_id = :formationId", { formationId })
        .andWhere("s.id IN (:...ids)", { ids: stagiaireIds })
        .select("s.id")
        .getMany();
      stagiaireIds = formationStagiaires.map((s) => s.id);
    }

    const stagiaires = await this.stagiaireRepository.find({
      where: { id: In(stagiaireIds) },
      select: ["id", "user_id"],
    });
    const userIds = stagiaires.map((s) => s.user_id).filter((id) => id != null);

    if (userIds.length === 0) {
      return { overall: {}, quiz_dropout: [] };
    }

    const query = this.quizParticipationRepository
      .createQueryBuilder("qp")
      .leftJoin("qp.quiz", "quiz")
      .leftJoin("quiz.formation", "formation")
      .select("qp.quiz_id", "quiz_id")
      .addSelect("quiz.titre", "quiz_name")
      .addSelect("formation.categorie", "category")
      .addSelect("COUNT(*)", "total_attempts")
      .addSelect(
        'SUM(CASE WHEN qp.status = "completed" THEN 1 ELSE 0 END)',
        "completed",
      )
      .addSelect(
        'SUM(CASE WHEN qp.status != "completed" THEN 1 ELSE 0 END)',
        "abandoned",
      )
      .where("qp.user_id IN (:...ids)", { ids: userIds });

    if (formationId) {
      query.andWhere(
        "quiz.formation_id = COALESCE((SELECT formation_id FROM catalogue_formations WHERE id = :cid), :cid)",
        { cid: formationId },
      );
    }

    const quizDropout = await query.groupBy("qp.quiz_id").getRawMany();

    const dropoutStats = quizDropout
      .map((qd) => {
        const total = parseInt(qd.total_attempts);
        const completed = parseInt(qd.completed);
        const abandoned = parseInt(qd.abandoned);
        const dropoutRate =
          total > 0 ? Math.round((abandoned / total) * 1000) / 10 : 0;

        return {
          quiz_name: qd.quiz_name || "Unknown",
          category: qd.category || "Général",
          total_attempts: total,
          completed,
          abandoned,
          dropout_rate: dropoutRate,
        };
      })
      .sort((a, b) => b.dropout_rate - a.dropout_rate);

    const totalAttempts = dropoutStats.reduce(
      (sum, d) => sum + d.total_attempts,
      0,
    );
    const totalCompleted = dropoutStats.reduce(
      (sum, d) => sum + d.completed,
      0,
    );
    const totalAbandoned = dropoutStats.reduce(
      (sum, d) => sum + d.abandoned,
      0,
    );

    return {
      overall: {
        total_attempts: totalAttempts,
        completed: totalCompleted,
        abandoned: totalAbandoned,
        dropout_rate:
          totalAttempts > 0
            ? Math.round((totalAbandoned / totalAttempts) * 1000) / 10
            : 0,
      },
      quiz_dropout: dropoutStats,
    };
  }

  async getFormateurFormationsPerformance(userId: number) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
      relations: ["formations", "formations.stagiaire_catalogue_formations"],
    });

    if (!formateur) return [];

    const performance = [];

    for (const formation of formateur.formations) {
      const stagiaireIds = formation.stagiaire_catalogue_formations.map(
        (scf: any) => scf.stagiaire_id,
      );

      if (stagiaireIds.length === 0) {
        performance.push({
          id: formation.id,
          nom: formation.titre,
          total_stagiaires: 0,
          completion_rate: 0,
          average_score: 0,
        });
        continue;
      }

      const stagiaires = await this.stagiaireRepository.find({
        where: { id: In(stagiaireIds) },
        select: ["id", "user_id"],
      });
      const userIds = stagiaires
        .map((s) => s.user_id)
        .filter((id) => id != null);

      if (userIds.length === 0) {
        performance.push({
          id: formation.id,
          nom: formation.titre,
          title: formation.titre,
          total_stagiaires: stagiaireIds.length,
          completion_rate: 0,
          average_score: 0,
        });
        continue;
      }

      const stats = await this.quizParticipationRepository
        .createQueryBuilder("qp")
        .select("COUNT(*)", "total")
        .addSelect(
          'SUM(CASE WHEN qp.status = "completed" THEN 1 ELSE 0 END)',
          "completed",
        )
        .addSelect("AVG(qp.score)", "avg_score")
        .where("qp.user_id IN (:...ids)", { ids: userIds })
        .andWhere(
          "qp.quiz_id IN (SELECT id FROM quizzes WHERE formation_id = :fid)",
          { fid: formation.formation_id },
        )
        .getRawOne();

      performance.push({
        id: formation.id,
        titre: formation.titre,
        image_url: formation.image_url,
        student_count: stagiaireIds.length,
        avg_score: Math.round((stats.avg_score || 0) * 10) / 10,
        total_completions: Number(stats.completed || 0),
      });
    }

    return performance;
  }

  async getFormateurStudentsComparison(userId: number, formationId?: number) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
      relations: ["stagiaires", "stagiaires.user"],
    });

    if (!formateur) return [];

    let stagiaires = formateur.stagiaires;

    if (formationId) {
      const formationStagiaires = await this.stagiaireRepository
        .createQueryBuilder("s")
        .innerJoin("s.stagiaire_catalogue_formations", "scf")
        .where("scf.catalogue_formation_id = :formationId", { formationId })
        .andWhere("s.id IN (:...ids)", {
          ids: stagiaires.map((s: any) => s.id),
        })
        .select("s.id")
        .getMany();

      const filteredIds = formationStagiaires.map((s) => s.id);
      stagiaires = stagiaires.filter((s: any) => filteredIds.includes(s.id));
    }

    const comparison = [];

    for (const stagiaire of stagiaires) {
      const stats = await this.quizParticipationRepository
        .createQueryBuilder("qp")
        .select("COUNT(*)", "total")
        .addSelect(
          'SUM(CASE WHEN qp.status = "completed" THEN 1 ELSE 0 END)',
          "completed",
        )
        .addSelect("AVG(qp.score)", "avg_score")
        .where("qp.user_id = :uid", { uid: stagiaire.user_id })
        .getRawOne();

      const rankingStats = await this.classementRepository
        .createQueryBuilder("c")
        .select("SUM(c.points)", "total_points")
        .where("c.stagiaire_id = :sid", { sid: stagiaire.id })
        .getRawOne();

      comparison.push({
        id: stagiaire.id,
        name: stagiaire.user?.name || stagiaire.prenom,
        prenom: stagiaire.prenom,
        nom: stagiaire.user?.name, // Assuming user.name stores the last name or full name
        email: stagiaire.user?.email,
        telephone: stagiaire.telephone,
        image: stagiaire.user?.image,
        total_quizzes: parseInt(stats.total),
        completed_quizzes: parseInt(stats.completed),
        avg_score: Math.round((stats.avg_score || 0) * 10) / 10,
        total_points: parseInt(rankingStats.total_points || 0),
        completion_rate:
          stats.total > 0
            ? Math.round((stats.completed / stats.total) * 1000) / 10
            : 0,
      });
    }

    return comparison.sort((a, b) => b.total_points - a.total_points);
  }

  /**
   * Consolidated dashboard home endpoint for mobile optimization.
   * Combines stats, inactive stagiaires, trends, and stagiaires progress
   * into a single API call to reduce network latency.
   */
  async getFormateurDashboardHome(userId: number, days: number = 7) {
    // Run all queries in parallel for maximum efficiency
    const [stats, inactiveResult, trends, progressResult] = await Promise.all([
      this.getFormateurDashboardStats(userId),
      this.getFormateurInactiveStagiaires(userId, days, "mine"),
      this.getFormateurTrends(userId),
      this.getFormateurStagiairesProgress(userId),
    ]);

    return {
      stats: stats || {
        total_stagiaires: 0,
        active_this_week: 0,
        inactive_count: 0,
        never_connected: 0,
        avg_quiz_score: 0,
        total_formations: 0,
        total_quizzes_taken: 0,
      },
      inactive_stagiaires: inactiveResult?.inactive_stagiaires || [],
      inactive_count: inactiveResult?.count || 0,
      trends: trends || { quiz_trends: [], activity_trends: [] },
      stagiaires: progressResult?.stagiaires || [],
      stagiaires_count: progressResult?.total || 0,
    };
  }

  async getFormateurFormationsWithVideos(userId: number) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
    });

    if (!formateur) {
      throw new NotFoundException(
        `Formateur avec l'utilisateur ID ${userId} introuvable`,
      );
    }

    // Use broader query logic to find all relevant formations (Direct + Indirect via students)
    const formations = await this.catalogueFormationRepository
      .createQueryBuilder("cf")
      .leftJoin("cf.formateurs", "f_direct") // Direct link
      .leftJoin("cf.stagiaire_catalogue_formations", "scf_any") // Via students link
      .leftJoin("scf_any.stagiaire", "s_any")
      .leftJoin("s_any.formateurs", "f_indirect")
      .where("(f_direct.id = :formateurId OR f_indirect.id = :formateurId)", {
        formateurId: formateur.id,
      })
      .leftJoinAndSelect("cf.formation", "real_formation")
      .leftJoinAndSelect("real_formation.medias", "media")
      .orderBy("cf.titre", "ASC")
      .getMany();

    const formationsWithVideos = formations.map((catalogue) => ({
      formation_id: catalogue.id,
      formation_titre: catalogue.titre,
      videos: (catalogue.formation?.medias || [])
        .filter((media) => media.type === "video")
        .map((media) => ({
          id: media.id,
          titre: media.titre,
          description: media.description,
          url: media.video_url || media.url,
          type: media.type,
          created_at:
            media.created_at?.toISOString() || new Date().toISOString(),
        })),
    }));

    return formationsWithVideos;
  }

  /**
   * Get stagiaires progress for the formateur dashboard.
   */
  async getFormateurStagiairesProgress(userId: number) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
      relations: ["stagiaires", "stagiaires.user"],
    });

    if (!formateur) {
      return { stagiaires: [], total: 0 };
    }

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const stagiaires = formateur.stagiaires.map((s) => {
      const isActive =
        s.user?.last_activity_at && s.user.last_activity_at > weekAgo;
      const neverConnected = !s.user?.last_login_at;

      return {
        id: s.id,
        prenom: s.prenom || "",
        nom: s.user?.name || "",
        email: s.user?.email || "",
        avatar: s.user?.image || null,
        is_active: isActive,
        never_connected: neverConnected,
        in_formation: true, // All students from formateur.stagiaires are in formation
        progress: 0, // TODO: Calculate actual progress from progressions table
        avg_score: 0, // TODO: Calculate from quiz participations
        modules_count: 0,
        formation: null, // TODO: Get primary formation name
        last_activity_at: s.user?.last_activity_at
          ? new Date(s.user.last_activity_at)
              .toISOString()
              .replace("T", " ")
              .substring(0, 19)
          : null,
      };
    });

    return {
      stagiaires,
      total: stagiaires.length,
    };
  }

  async getVideoStats(videoId: number) {
    const media = await this.mediaRepository.findOne({
      where: { id: videoId, type: "video" },
    });

    if (!media) {
      throw new NotFoundException(`Vidéo avec l'ID ${videoId} introuvable`);
    }

    try {
      const trackings = await this.mediaStagiaireRepository.find({
        where: { media_id: videoId },
        relations: ["stagiaire", "stagiaire.user"],
        select: {
          media_id: true,
          stagiaire_id: true,
          is_watched: true,
          watched_at: true,
          created_at: true,
          updated_at: true,
          current_time: true,
          duration: true,
          stagiaire: {
            id: true,
            prenom: true,
            user: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      const totalViews = trackings.length;
      const totalDurationWatched = trackings.reduce(
        (acc, t) => acc + (t.current_time || 0),
        0,
      );
      const avgCompletion =
        totalViews > 0
          ? Math.round(
              trackings.reduce((acc, t) => {
                const duration = t.duration || 0;
                const current = t.current_time || 0;
                const pct = duration > 0 ? (current / duration) * 100 : 0;
                return acc + pct;
              }, 0) / totalViews,
            )
          : 0;

      return {
        video_id: videoId,
        total_views: totalViews,
        total_duration_watched: totalDurationWatched,
        completion_rate: avgCompletion,
        views_by_stagiaire: trackings.map((t) => {
          const duration = t.duration || 0;
          const current = t.current_time || 0;
          const percentage =
            duration > 0 ? Math.round((current / duration) * 100) : 0;

          return {
            id: t.stagiaire?.id || 0,
            prenom: t.stagiaire?.prenom || "Stagiaire",
            nom: t.stagiaire?.user?.name || "Inconnu",
            completed: !!t.is_watched,
            total_watched: current,
            percentage: percentage,
          };
        }),
      };
    } catch (error) {
      console.error("Error fetching video stats:", error);
      // Return empty stats if tracking data fails to load
      return {
        video_id: videoId,
        total_views: 0,
        total_duration_watched: 0,
        completion_rate: 0,
        views_by_stagiaire: [],
      };
    }
  }

  async getStagiaireFullFormations(id: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id },
      relations: [
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.catalogue_formation",
        "stagiaire_catalogue_formations.catalogue_formation.formation",
        "stagiaire_catalogue_formations.catalogue_formation.formation.medias",
        "medias",
      ],
    });

    if (!stagiaire) throw new NotFoundException("Stagiaire non trouvé");

    return stagiaire.stagiaire_catalogue_formations.map((scf) => {
      const formation = scf.catalogue_formation?.formation;
      const videos = formation?.medias?.filter((m) => m.type === "video") || [];
      const totalVideos = videos.length;
      const watchedCount =
        stagiaire.medias?.filter((wm) => videos.some((v) => v.id === wm.id))
          .length || 0;

      return {
        id: scf.catalogue_formation?.id,
        titre: scf.catalogue_formation?.titre || "Formation",
        completions: watchedCount,
        total_videos: totalVideos,
        avg_score: scf.date_fin
          ? 100
          : Math.round((watchedCount / (totalVideos || 1)) * 100),
        last_activity: scf.updated_at,
        best_score: scf.date_fin ? 100 : 0,
      };
    });
  }

  async getFormateurFormationStagiaires(userId: number, formationId: number) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
    });
    if (!formateur) throw new NotFoundException("Formateur non trouvé");

    const formation = await this.catalogueFormationRepository.findOne({
      where: { id: formationId },
      relations: ["formation", "formation.medias"],
    });

    if (!formation) throw new NotFoundException("Formation introuvable");

    const stagiaires = await this.stagiaireRepository.find({
      where: {
        formateurs: { id: formateur.id },
        stagiaire_catalogue_formations: { catalogue_formation_id: formationId },
      },
      relations: ["user", "medias", "stagiaire_catalogue_formations"],
    });

    const totalVideos =
      formation.formation?.medias?.filter((m) => m.type === "video").length ||
      0;

    return {
      formation: {
        id: formation.id,
        titre: formation.titre,
        categorie: formation.formation?.categorie,
      },
      stagiaires: stagiaires.map((stagiaire) => {
        const watchedCount =
          stagiaire.medias?.filter((w) =>
            formation.formation?.medias?.some((m) => m.id === w.id),
          ).length || 0;

        const progress =
          totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
        const scf = stagiaire.stagiaire_catalogue_formations.find(
          (s) => s.catalogue_formation_id == formationId,
        );

        return {
          id: stagiaire.id,
          prenom: stagiaire.prenom,
          nom: stagiaire.user?.name || "",
          email: stagiaire.user?.email || "",
          date_debut: scf?.date_debut,
          date_fin: scf?.date_fin,
          progress,
          status: stagiaire.statut,
        };
      }),
    };
  }

  async assignFormateurFormationStagiaires(
    userId: number,
    formationId: number,
    stagiaireIds: number[],
    dateDebut?: Date,
    dateFin?: Date,
  ) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
    });
    if (!formateur) throw new NotFoundException("Formateur non trouvé");

    const formation = await this.catalogueFormationRepository.findOne({
      where: { id: formationId },
    });
    if (!formation) throw new NotFoundException("Formation introuvable");

    // Verify stagiaires belong to formateur
    const stagiaires = await this.stagiaireRepository.find({
      where: {
        id: In(stagiaireIds),
        formateurs: { id: formateur.id },
      },
    });

    if (stagiaires.length !== stagiaireIds.length) {
      throw new Error("Certains stagiaires n'appartiennent pas à ce formateur");
    }

    let assigned = 0;
    for (const stagiaire of stagiaires) {
      const existing = await this.stagiaireCatalogueFormationRepository.findOne(
        {
          where: {
            stagiaire_id: stagiaire.id,
            catalogue_formation_id: formationId,
          },
        },
      );

      if (!existing) {
        const assignment = this.stagiaireCatalogueFormationRepository.create({
          stagiaire_id: stagiaire.id,
          catalogue_formation_id: formationId,
          date_debut: dateDebut || new Date(),
          date_fin: dateFin,
          formateur_id: formateur.id,
        });
        await this.stagiaireCatalogueFormationRepository.save(assignment);
        assigned++;
      } else {
        // Update dates if needed
        if (dateDebut) existing.date_debut = dateDebut;
        if (dateFin) existing.date_fin = dateFin;
        await this.stagiaireCatalogueFormationRepository.save(existing);
      }
    }

    return {
      success: true,
      message: `${assigned} stagiaire(s) assigné(s) à la formation ${formation.titre}`,
      assigned_count: assigned,
    };
  }

  async getDemandesSuivi(userId: number, role: string) {
    const query = this.demandeInscriptionRepository
      .createQueryBuilder("d")
      .leftJoinAndSelect("d.filleul", "filleul")
      .leftJoinAndSelect("filleul.stagiaire", "stagiaire")
      .leftJoinAndSelect("d.formation", "formation")
      .limit(100);

    if (role === "stagiaire") {
      query.andWhere("d.filleul_id = :userId", { userId });
    } else if (role === "formateur" || role === "formatrice") {
      const formateur = await this.formateurRepository.findOne({
        where: { user_id: userId },
      });
      if (formateur) {
        query
          .innerJoin(Stagiaire, "s", "s.user_id = d.filleul_id")
          .innerJoin("s.formateurs", "f", "f.id = :fId", { fId: formateur.id });
      }
    } else if (role === "commercial") {
      query.innerJoin(
        "commercial",
        "c",
        "c.user_id = :userId AND d.filleul_id IN (SELECT user_id FROM stagiaires WHERE commercial_id = c.id)",

        { userId },
      );
    }

    const demandes = await query.orderBy("d.date_demande", "DESC").getMany();

    return demandes.map((d) => ({
      id: d.id,
      date: d.date_demande,
      statut: d.statut,
      formation: d.formation?.titre || "Formation",
      stagiaire: d.filleul
        ? {
            id: d.filleul.stagiaire?.id,
            name: d.filleul.name,
            prenom: d.filleul.stagiaire?.prenom,
          }
        : null,

      motif: d.motif,
    }));
  }

  async getParrainageSuivi(userId: number, role: string) {
    const query = this.parrainageRepository
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.filleul", "filleul")
      .leftJoinAndSelect("filleul.stagiaire", "stagiaire")
      .leftJoinAndSelect("p.parrain", "parrain");

    if (role === "stagiaire") {
      query.andWhere("p.parrain_id = :userId", { userId });
    } else if (role === "formateur" || role === "formatrice") {
      const formateur = await this.formateurRepository.findOne({
        where: { user_id: userId },
      });
      if (formateur) {
        query
          .leftJoin(Stagiaire, "s_filter", "s_filter.user_id = p.filleul_id")
          .leftJoin("s_filter.formateurs", "f_filter")
          .andWhere("(p.parrain_id = :userId OR f_filter.id = :fId)", {
            userId,
            fId: formateur.id,
          });
      }
    } else if (role === "commercial") {
      query.innerJoin(
        "commercial",
        "c",
        "c.user_id = :userId AND (p.filleul_id IN (SELECT user_id FROM stagiaires WHERE commercial_id = c.id) OR p.parrain_id IN (SELECT user_id FROM stagiaires WHERE commercial_id = c.id))",
        { userId },
      );
    }

    const parrainages = await query
      .orderBy("p.date_parrainage", "DESC")
      .getMany();

    return parrainages.map((p) => ({
      id: p.id,
      date: p.date_parrainage,
      points: p.points,
      gains: p.gains,
      parrain: p.parrain ? { name: p.parrain.name } : null,
      filleul: p.filleul
        ? {
            id: p.filleul.stagiaire?.id,
            name: p.filleul.name,
            prenom: p.filleul.stagiaire?.prenom,
            statut: p.filleul.stagiaire?.statut,
          }
        : null,
    }));
  }

  async sendFormateurEmail(
    senderId: number,
    recipientIds: number[],
    subject: string,
    message: string,
  ) {
    // 1. Get Sender (Formateur)
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    if (!sender) {
      throw new NotFoundException("Expéditeur non trouvé");
    }

    // 2. Get Recipients (Stagiaires)
    const stagiaires = await this.stagiaireRepository.find({
      where: { id: In(recipientIds) },
      relations: ["user"],
    });

    if (stagiaires.length === 0) {
      throw new NotFoundException("Aucun destinataire trouvé");
    }

    // 3. Send Emails
    const results = [];
    for (const stagiaire of stagiaires) {
      if (stagiaire.user?.email) {
        try {
          await this.mailService.sendUserEmail(
            stagiaire.user,
            subject,
            `
              <p>Bonjour ${stagiaire.prenom},</p>
              <p>Vous avez reçu un message de votre formateur <strong>${sender.name}</strong>:</p>
              <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; margin: 10px 0;">
                ${message.replace(/\n/g, "<br>")}
              </blockquote>
              <p>Cordialement,<br>L'équipe Wizi Learn</p>
            `,
          );
          results.push({ id: stagiaire.id, status: "sent" });
        } catch (error) {
          console.error(
            `Failed to send email to ${stagiaire.user.email}`,
            error,
          );
          results.push({
            id: stagiaire.id,
            status: "failed",
            error: error.message,
          });
        }
      } else {
        results.push({
          id: stagiaire.id,
          status: "skipped",
          reason: "no_email",
        });
      }
    }

    return {
      sent_count: results.filter((r) => r.status === "sent").length,
      details: results,
    };
  }

  async getFormateurStudentsPerformance(userId: number) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
      relations: ["stagiaires", "stagiaires.user"],
    });

    if (!formateur || !formateur.stagiaires) return [];

    const stagiaireIds = formateur.stagiaires.map((s) => s.id);
    if (stagiaireIds.length === 0) return [];

    const userIds = formateur.stagiaires
      .map((s) => s.user_id)
      .filter((id) => id !== null);

    // Get quizzes stats per user
    const quizzesStats = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .select("qp.user_id", "user_id")
      .addSelect("COUNT(DISTINCT qp.id)", "total_quizzes")
      .addSelect("AVG(qp.score)", "avg_score")
      .addSelect("MAX(qp.score)", "best_score")
      .addSelect("SUM(qp.score)", "total_points")
      .where("qp.user_id IN (:...userIds)", { userIds })
      .groupBy("qp.user_id")
      .getRawMany();

    const quizzesMap = new Map(
      quizzesStats.map((s) => [
        parseInt(s.user_id),
        {
          total: parseInt(s.total_quizzes) || 0,
          avg: parseFloat(s.avg_score) || 0,
          best: parseInt(s.best_score) || 0,
          points: parseInt(s.total_points) || 0,
        },
      ]),
    );

    return formateur.stagiaires.map((s) => {
      const stats = quizzesMap.get(s.user_id) || {
        total: 0,
        avg: 0,
        best: 0,
        points: 0,
      };

      // Attempt to split full name if only name is available
      let displayPrenom = s.prenom || "";
      let displayNom = s.user?.name || "";

      return {
        id: s.id,
        prenom: displayPrenom,
        nom: displayNom,
        name: displayNom, // For backward compatibility
        email: s.user?.email || "",
        avatar: s.user?.image || null,
        total_points: stats.points,
        total_quizzes: stats.total,
        average_score: Math.round(stats.avg),
        best_score: stats.best,
        total_logins: s.user?.login_streak || 0, // Using login streak as proxy for activity
        last_active: s.user?.last_activity_at,
      };
    });
  }
}
