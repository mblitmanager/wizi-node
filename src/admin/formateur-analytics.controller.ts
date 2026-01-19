import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { ApiResponseService } from "../common/services/api-response.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Formateur } from "../entities/formateur.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";

import { AdminService } from "./admin.service";

@Controller("formateur/analytics")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("formateur", "formatrice")
export class FormateurAnalyticsController {
  constructor(
    @InjectRepository(Formateur)
    private formateurRepository: Repository<Formateur>,
    @InjectRepository(QuizParticipation)
    private quizParticipationRepository: Repository<QuizParticipation>,
    private adminService: AdminService,
    private apiResponse: ApiResponseService
  ) {}

  @Get("formations/performance")
  async getFormationsPerformance(@Request() req) {
    const data = await this.adminService.getFormateurFormations(req.user.id);
    return this.apiResponse.success(data);
  }

  @Get("stagiaire/:id/formations")
  async getStagiaireFormations(@Param("id") id: number) {
    const data = await this.adminService.getStagiaireFormationPerformance(id);
    return this.apiResponse.success(data);
  }

  @Get("quiz-success-rate")
  async getQuizSuccessRate(
    @Query("period") period: number = 30,
    @Request() req
  ) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
      relations: ["stagiaires"],
    });

    const stagiaireIds = formateur.stagiaires.map((s: any) => s.id);

    const participations = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .leftJoinAndSelect("qp.quiz", "quiz")
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .andWhere("qp.status = :status", { status: "completed" })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
        days: period,
      })
      .getMany();

    const quizStatsMap = new Map();

    participations.forEach((p: any) => {
      if (!quizStatsMap.has(p.quiz_id)) {
        quizStatsMap.set(p.quiz_id, {
          quiz_id: p.quiz_id,
          quiz_name: p.quiz.titre,
          category: p.quiz.categorie || "Général",
          participations: [],
        });
      }
      quizStatsMap.get(p.quiz_id).participations.push(p);
    });

    const quizStats = Array.from(quizStatsMap.values()).map((stat) => {
      const total = stat.participations.length;
      const successful = stat.participations.filter((p: any) => {
        const maxScore = p.quiz.nb_points_total || 100;
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

    return this.apiResponse.success({
      period_days: period,
      quiz_stats: quizStats,
    });
  }

  @Get("completion-time")
  async getCompletionTime(
    @Query("period") period: number = 30,
    @Request() req
  ) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
      relations: ["stagiaires"],
    });

    const stagiaireIds = formateur.stagiaires.map((s: any) => s.id);

    // Daily trends
    const trends = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .select("DATE(qp.created_at)", "date")
      .addSelect("AVG(qp.time_spent)", "avg_time")
      .addSelect("COUNT(*)", "count")
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .andWhere("qp.status = :status", { status: "completed" })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
        days: period,
      })
      .groupBy("DATE(qp.created_at)")
      .orderBy("date", "ASC")
      .getRawMany();

    const completionTrends = trends.map((t) => ({
      date: t.date,
      avg_time_minutes: Math.round((t.avg_time / 60) * 10) / 10,
      quiz_count: parseInt(t.count),
    }));

    // Per quiz
    const quizTimes = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .leftJoinAndSelect("qp.quiz", "quiz")
      .select("qp.quiz_id", "quiz_id")
      .addSelect("quiz.titre", "quiz_name")
      .addSelect("quiz.categorie", "category")
      .addSelect("AVG(qp.time_spent)", "avg_time")
      .addSelect("COUNT(*)", "attempts")
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .andWhere("qp.status = :status", { status: "completed" })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
        days: period,
      })
      .groupBy("qp.quiz_id")
      .getRawMany();

    const quizAvgTimes = quizTimes.map((qt) => ({
      quiz_name: qt.quiz_name,
      category: qt.category || "Général",
      avg_time_minutes: Math.round((qt.avg_time / 60) * 10) / 10,
      attempts: parseInt(qt.attempts),
    }));

    return this.apiResponse.success({
      period_days: period,
      completion_trends: completionTrends,
      quiz_avg_times: quizAvgTimes,
    });
  }

  @Get("activity-heatmap")
  async getActivityHeatmap(
    @Query("period") period: number = 30,
    @Request() req
  ) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
      relations: ["stagiaires"],
    });

    const stagiaireIds = formateur.stagiaires.map((s: any) => s.id);

    // By day of week
    const byDay = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .select("DAYOFWEEK(qp.created_at)", "day_of_week")
      .addSelect("COUNT(*)", "activity_count")
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
        days: period,
      })
      .groupBy("day_of_week")
      .orderBy("day_of_week", "ASC")
      .getRawMany();

    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const activityByDay = byDay.map((bd) => ({
      day: days[bd.day_of_week - 1] || "Unknown",
      activity_count: parseInt(bd.activity_count),
    }));

    // By hour
    const byHour = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .select("HOUR(qp.created_at)", "hour")
      .addSelect("COUNT(*)", "activity_count")
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
        days: period,
      })
      .groupBy("hour")
      .orderBy("hour", "ASC")
      .getRawMany();

    const activityByHour = byHour.map((bh) => ({
      hour: parseInt(bh.hour),
      activity_count: parseInt(bh.activity_count),
    }));

    return this.apiResponse.success({
      period_days: period,
      activity_by_day: activityByDay,
      activity_by_hour: activityByHour,
    });
  }

  @Get("dropout-rate")
  async getDropoutRate(@Request() req) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
      relations: ["stagiaires"],
    });

    const stagiaireIds = formateur.stagiaires.map((s: any) => s.id);

    const quizDropout = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .leftJoinAndSelect("qp.quiz", "quiz")
      .select("qp.quiz_id", "quiz_id")
      .addSelect("quiz.titre", "quiz_name")
      .addSelect("quiz.categorie", "category")
      .addSelect("COUNT(*)", "total_attempts")
      .addSelect(
        'SUM(CASE WHEN qp.status = "completed" THEN 1 ELSE 0 END)',
        "completed"
      )
      .addSelect(
        'SUM(CASE WHEN qp.status != "completed" THEN 1 ELSE 0 END)',
        "abandoned"
      )
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .groupBy("qp.quiz_id")
      .getRawMany();

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
      0
    );
    const totalCompleted = dropoutStats.reduce(
      (sum, d) => sum + d.completed,
      0
    );
    const totalAbandoned = dropoutStats.reduce(
      (sum, d) => sum + d.abandoned,
      0
    );

    return this.apiResponse.success({
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
    });
  }

  @Get("dashboard")
  async getDashboard(@Query("period") period: number = 30, @Request() req) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
      relations: ["stagiaires"],
    });

    const stagiaireIds = formateur.stagiaires.map((s: any) => s.id);
    const totalStagiaires = stagiaireIds.length;

    // Active stagiaires (last 7 days)
    const activeStagiaires = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .select("DISTINCT qp.stagiaire_id")
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")
      .getRawMany();

    // Total completions
    const totalCompletions = await this.quizParticipationRepository.count({
      where: {
        stagiaire_id: stagiaireIds as any,
        status: "completed",
      } as any,
    });

    // Average score
    const avgScoreResult = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .select("AVG(qp.score)", "avg_score")
      .where("qp.stagiaire_id IN (:...ids)", { ids: stagiaireIds })
      .andWhere("qp.status = :status", { status: "completed" })
      .andWhere("qp.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)", {
        days: period,
      })
      .getRawOne();

    // Previous period completions for trend
    const previousCompletions = await this.quizParticipationRepository.count({
      where: {
        stagiaire_id: stagiaireIds as any,
        status: "completed",
      } as any,
    });

    const trend =
      previousCompletions > 0
        ? Math.round(
            ((totalCompletions - previousCompletions) / previousCompletions) *
              1000
          ) / 10
        : 0;

    return this.apiResponse.success({
      period_days: period,
      summary: {
        total_stagiaires: totalStagiaires,
        active_stagiaires: activeStagiaires.length,
        total_completions: totalCompletions,
        average_score: Math.round((avgScoreResult?.avg_score || 0) * 10) / 10,
        trend_percentage: trend,
      },
    });
  }

  @Get("performance")
  async getStudentPerformance(@Request() req) {
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
      relations: ["stagiaires", "stagiaires.user"],
    });

    if (!formateur) {
      return this.apiResponse.success({
        performance: [],
        rankings: {
          most_quizzes: [],
          most_active: [],
        },
      });
    }

    const userIds = formateur.stagiaires
      ? formateur.stagiaires
          .map((s: any) => s.user_id)
          .filter((id) => id != null)
      : [];

    if (userIds.length === 0) {
      return this.apiResponse.success({
        performance: [],
        rankings: {
          most_quizzes: [],
          most_active: [],
        },
      });
    }

    // Get Quiz Stats per User
    const quizStats = await this.quizParticipationRepository
      .createQueryBuilder("qp")
      .select("qp.user_id", "user_id")
      .addSelect("COUNT(DISTINCT qp.quiz_id)", "total_quizzes")
      .addSelect("MAX(qp.created_at)", "last_quiz_at")
      .where("qp.user_id IN (:...ids)", { ids: userIds })
      .andWhere("qp.status = :status", { status: "completed" })
      .groupBy("qp.user_id")
      .getRawMany();

    // Map stats to users
    const statsMap = new Map();
    quizStats.forEach((stat) => {
      statsMap.set(parseInt(stat.user_id), {
        total_quizzes: parseInt(stat.total_quizzes),
        last_quiz_at: stat.last_quiz_at,
      });
    });

    // Build Performance Data
    const performanceData = formateur.stagiaires.map((stagiaire: any) => {
      const stats = statsMap.get(stagiaire.user_id) || {
        total_quizzes: 0,
        last_quiz_at: null,
      };

      return {
        id: stagiaire.id,
        name: stagiaire.user?.name || stagiaire.prenom || "Apprenant",
        email: stagiaire.user?.email,
        image: stagiaire.user?.image,
        last_quiz_at: stats.last_quiz_at,
        total_quizzes: stats.total_quizzes,
        total_logins: stagiaire.login_streak || 0,
      };
    });

    // Sort for Rankings
    const mostQuizzes = [...performanceData]
      .sort((a, b) => b.total_quizzes - a.total_quizzes)
      .slice(0, 5);

    const mostActive = [...performanceData]
      .sort((a, b) => b.total_logins - a.total_logins)
      .slice(0, 5);

    return this.apiResponse.success({
      performance: performanceData,
      rankings: {
        most_quizzes: mostQuizzes,
        most_active: mostActive,
      },
    });
  }
}
