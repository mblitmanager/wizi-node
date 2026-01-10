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

    return {
      total_stagiaires: totalStagiaires,
      active_this_week: activeThisWeek,
      inactive_count: inactiveCount,
      never_connected: neverConnected,
      avg_quiz_score: parseFloat(avgScore.toFixed(1)),
      // Simplified versions for now
      total_formations: 0,
      total_quizzes_taken: 0,
      total_video_hours: 0,
      formations: { data: [] },
      formateurs: { data: [] },
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
