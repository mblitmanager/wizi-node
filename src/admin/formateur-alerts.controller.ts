import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { ApiResponseService } from "../common/services/api-response.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Formateur } from "../entities/formateur.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";

@Controller("formateur")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("formateur", "formatrice")
export class FormateurAlertsController {
  constructor(
    @InjectRepository(Formateur)
    private formateurRepository: Repository<Formateur>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(QuizParticipation)
    private quizParticipationRepository: Repository<QuizParticipation>,
    private apiResponse: ApiResponseService
  ) {}

  @Get("alerts")
  async getAlerts(@Request() req) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
      relations: ["stagiaires", "stagiaires.user"],
    });

    const alerts: any[] = [];
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    // 1. Inactive Students (no activity in 7 days)
    for (const stagiaire of formateur.stagiaires) {
      const recentActivity = await this.quizParticipationRepository.count({
        where: {
          stagiaire_id: stagiaire.id,
        } as any,
      });

      if (recentActivity === 0 && stagiaire.statut) {
        alerts.push({
          id: `inactive_${stagiaire.id}`,
          type: "warning",
          category: "inactivity",
          title: "Stagiaire inactif",
          message: `${stagiaire.user.prenom} ${stagiaire.user.nom} n'a pas participé depuis 7 jours`,
          stagiaire_id: stagiaire.id,
          stagiaire_name: `${stagiaire.user.prenom} ${stagiaire.user.nom}`,
          priority: "medium",
          created_at: new Date().toISOString(),
        });
      }
    }

    // 2. Approaching Deadlines (within 7 days)
    const deadlineStagiaires = formateur.stagiaires.filter((s: any) => {
      if (!s.date_fin_formation) return false;
      const deadline = new Date(s.date_fin_formation);
      const now = new Date();
      const daysLeft = Math.ceil(
        (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysLeft >= 0 && daysLeft <= 7;
    });

    deadlineStagiaires.forEach((stagiaire: any) => {
      const deadline = new Date(stagiaire.date_fin_formation);
      const now = new Date();
      const daysLeft = Math.ceil(
        (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      alerts.push({
        id: `deadline_${stagiaire.id}`,
        type: "info",
        category: "deadline",
        title: "Deadline approchante",
        message: `Formation de ${stagiaire.user.prenom} ${stagiaire.user.nom} se termine dans ${daysLeft} jour(s)`,
        stagiaire_id: stagiaire.id,
        stagiaire_name: `${stagiaire.user.prenom} ${stagiaire.user.nom}`,
        days_left: daysLeft,
        priority: daysLeft <= 3 ? "high" : "medium",
        created_at: new Date().toISOString(),
      });
    });

    // 3. Low Performance (avg score < 50%)
    const stagiaireIds = formateur.stagiaires.map((s: any) => s.id);
    const lowPerformers = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .select("qp.stagiaire_id", "stagiaire_id")
      .addSelect("AVG(qp.score)", "avg_score")
      .addSelect("COUNT(*)", "attempts")
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .andWhere("qp.status = :status", { status: "completed" })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")
      .groupBy("qp.stagiaire_id")
      .having("avg_score < 50")
      .andHaving("attempts >= 3")
      .getRawMany();

    for (const performer of lowPerformers) {
      const stagiaire = formateur.stagiaires.find(
        (s: any) => s.id == performer.stagiaire_id
      );
      if (stagiaire) {
        alerts.push({
          id: `low_performance_${stagiaire.id}`,
          type: "danger",
          category: "performance",
          title: "Performance faible",
          message: `${stagiaire.user.prenom} ${stagiaire.user.nom} a un score moyen de ${Math.round(performer.avg_score * 10) / 10}% sur ${performer.attempts} quiz`,
          stagiaire_id: stagiaire.id,
          stagiaire_name: `${stagiaire.user.prenom} ${stagiaire.user.nom}`,
          avg_score: Math.round(performer.avg_score * 10) / 10,
          priority: "high",
          created_at: new Date().toISOString(),
        });
      }
    }

    // 4. High Dropout (>60%)
    const highDropout = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .select("qp.stagiaire_id", "stagiaire_id")
      .addSelect("COUNT(*)", "total")
      .addSelect(
        'SUM(CASE WHEN qp.status != "completed" THEN 1 ELSE 0 END)',
        "abandoned"
      )
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")
      .groupBy("qp.stagiaire_id")
      .having("total >= 3")
      .getRawMany();

    highDropout.forEach((dropout: any) => {
      const dropoutRate = (dropout.abandoned / dropout.total) * 100;
      if (dropoutRate > 60) {
        const stagiaire = formateur.stagiaires.find(
          (s: any) => s.id == dropout.stagiaire_id
        );
        if (stagiaire) {
          alerts.push({
            id: `dropout_${stagiaire.id}`,
            type: "warning",
            category: "dropout",
            title: "Taux d'abandon élevé",
            message: `${stagiaire.user.prenom} ${stagiaire.user.nom} abandonne ${Math.round(dropoutRate * 10) / 10}% des quiz`,
            stagiaire_id: stagiaire.id,
            stagiaire_name: `${stagiaire.user.prenom} ${stagiaire.user.nom}`,
            dropout_rate: Math.round(dropoutRate * 10) / 10,
            priority: "high",
            created_at: new Date().toISOString(),
          });
        }
      }
    });

    // 5. Never Connected (no participations + registered 3+ days ago)
    const neverConnected = formateur.stagiaires.filter((s: any) => {
      const createdDate = new Date(s.created_at);
      const daysAgo = Math.ceil(
        (new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysAgo > 3;
    });

    for (const stagiaire of neverConnected) {
      const hasParticipation = await this.quizParticipationRepository.count({
        where: { stagiaire_id: stagiaire.id } as any,
      });

      if (hasParticipation === 0) {
        const createdDate = new Date(stagiaire.created_at);
        const daysAgo = Math.ceil(
          (new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        alerts.push({
          id: `never_connected_${stagiaire.id}`,
          type: "danger",
          category: "never_connected",
          title: "Jamais connecté",
          message: `${stagiaire.user.prenom} ${stagiaire.user.nom} n'a jamais participé (inscrit il y a ${daysAgo} jours)`,
          stagiaire_id: stagiaire.id,
          stagiaire_name: `${stagiaire.user.prenom} ${stagiaire.user.nom}`,
          days_since_registration: daysAgo,
          priority: "high",
          created_at: new Date().toISOString(),
        });
      }
    }

    // Sort by priority
    alerts.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    return this.apiResponse.success({
      alerts,
      total_count: alerts.length,
      high_priority_count: alerts.filter((a) => a.priority === "high").length,
    });
  }

  @Get("alerts/stats")
  async getAlertStats(@Request() req) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
      relations: ["stagiaires"],
    });

    const stagiaireIds = formateur.stagiaires.map((s: any) => s.id);

    // Inactive
    const inactive = formateur.stagiaires.filter(async (s: any) => {
      const count = await this.quizParticipationRepository.count({
        where: { stagiaire_id: s.id } as any,
      });
      return count === 0 && s.statut;
    }).length;

    // Approaching deadline
    const deadlineCount = formateur.stagiaires.filter((s: any) => {
      if (!s.date_fin_formation) return false;
      const deadline = new Date(s.date_fin_formation);
      const now = new Date();
      const daysLeft = Math.ceil(
        (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysLeft >= 0 && daysLeft <= 7;
    }).length;

    // Low performers
    const lowPerformersCount = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .select("qp.stagiaire_id")
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .andWhere("qp.status = :status", { status: "completed" })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")
      .groupBy("qp.stagiaire_id")
      .having("AVG(qp.score) < 50")
      .getCount();

    // Never connected
    const neverConnectedCount = formateur.stagiaires.filter(async (s: any) => {
      const daysAgo = Math.ceil(
        (new Date().getTime() - new Date(s.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const count = await this.quizParticipationRepository.count({
        where: { stagiaire_id: s.id } as any,
      });
      return daysAgo > 3 && count === 0;
    }).length;

    return this.apiResponse.success({
      stats: {
        inactive,
        approaching_deadline: deadlineCount,
        low_performance: lowPerformersCount,
        never_connected: neverConnectedCount,
        total:
          inactive + deadlineCount + lowPerformersCount + neverConnectedCount,
      },
    });
  }
}
