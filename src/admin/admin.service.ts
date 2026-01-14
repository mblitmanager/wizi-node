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
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: userId },
      relations: ["stagiaires", "stagiaires.user"],
    });

    if (!formateur) {
      console.log("Formateur not found for userId:", userId);
      return {
        performance: [],
        rankings: { most_quizzes: [], most_active: [] },
      };
    }

    console.log("Formateur found:", formateur.id);
    console.log("Stagiaires count:", formateur.stagiaires?.length);

    const stagiaires = formateur.stagiaires;
    const userIds = stagiaires
      .map((s) => s.user_id)
      .filter((id) => id !== null);

    let quizStats = new Map<number, { count: number; last_at: Date }>();
    if (userIds.length > 0) {
      const stats = await this.quizParticipationRepository
        .createQueryBuilder("qp")
        .select("qp.user_id", "user_id")
        .addSelect("COUNT(qp.id)", "count")
        .addSelect("MAX(qp.created_at)", "last_at")
        .where("qp.user_id IN (:...userIds)", { userIds })
        .groupBy("qp.user_id")
        .getRawMany();

      stats.forEach((stat) => {
        quizStats.set(stat.user_id, {
          count: parseInt(stat.count),
          last_at: new Date(stat.last_at),
        });
      });
    }

    const performance = stagiaires.map((s) => {
      const stats = quizStats.get(s.user_id) || { count: 0, last_at: null };
      return {
        id: s.id,
        name: s.user?.name || `${s.prenom} ${s.nom || ""}`,
        email: s.user?.email || s.email,
        image: s.user?.image || null,
        last_quiz_at: stats.last_at
          ? new Date(stats.last_at.getTime() + 3 * 60 * 60 * 1000)
              .toISOString()
              .replace("T", " ")
              .substring(0, 19)
          : null,
        total_quizzes: stats.count,
        total_logins: s.login_streak || 0, // Mapping login_streak to total_logins as best proxy
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

  async getOnlineStagiaires() {
    return this.stagiaireRepository.find({
      where: { user: { is_online: true } },
      relations: [
        "user",
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.catalogue_formation",
      ],
    });
  }
}
