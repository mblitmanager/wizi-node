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

    // Calculate total formations assigned to formateur's stagiaires
    const formationIds = new Set<number>();
    for (const stagiaire of stagiaires) {
      if (stagiaire.stagiaire_catalogue_formations) {
        stagiaire.stagiaire_catalogue_formations.forEach((scf) => {
          formationIds.add(scf.catalogue_formation_id);
        });
      }
    }
    const totalFormations = formationIds.size;

    // Calculate total quizzes taken by formateur's stagiaires
    let totalQuizzesTaken = 0;
    if (userIds.length > 0) {
      totalQuizzesTaken = await this.quizParticipationRepository.count({
        where: { user_id: In(userIds) },
      });
    }

    // Get formations details (top 5 for dashboard)
    const formations = await this.formationRepository.find({
      where: { id: In([...formationIds]) },
      take: 5,
    });

    return {
      total_stagiaires: totalStagiaires,
      active_this_week: activeThisWeek,
      inactive_count: inactiveCount,
      never_connected: neverConnected,
      avg_quiz_score: parseFloat(avgScore.toFixed(1)),
      total_formations: totalFormations,
      total_quizzes_taken: totalQuizzesTaken,
      total_video_hours: 0, // Placeholder as video tracking logic is complex
      formations: {
        data: formations.map((f) => ({
          id: f.id,
          titre: f.titre,
        })),
        current_page: 1,
        first_page_url:
          "http://127.0.0.1:3000/api/formateur/dashboard/stats?page=1",
        from: 1,
        last_page: 1,
        last_page_url:
          "http://127.0.0.1:3000/api/formateur/dashboard/stats?page=1",
        links: [],
        next_page_url: null,
        path: "http://127.0.0.1:3000/api/formateur/dashboard/stats",
        per_page: 10,
        prev_page_url: null,
        to: formations.length,
        total: formations.length,
      },
      formateurs: {
        data: [],
        current_page: 1,
        first_page_url:
          "http://127.0.0.1:3000/api/formateur/dashboard/stats?page=1",
        from: null,
        last_page: 1,
        last_page_url:
          "http://127.0.0.1:3000/api/formateur/dashboard/stats?page=1",
        links: [],
        next_page_url: null,
        path: "http://127.0.0.1:3000/api/formateur/dashboard/stats",
        per_page: 10,
        prev_page_url: null,
        to: null,
        total: 0,
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
