import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponseService } from "../common/services/api-response.service";
import { AdminService } from "./admin.service";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Formateur } from "../entities/formateur.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";

@Controller("formateur")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("formateur", "formatrice")
export class FormateurApiController {
  constructor(
    private apiResponse: ApiResponseService,
    private adminService: AdminService,
    @InjectRepository(Formateur)
    private formateurRepository: Repository<Formateur>,
    @InjectRepository(QuizParticipation)
    private quizParticipationRepository: Repository<QuizParticipation>,
  ) {}

  /**
   * Consolidated dashboard home endpoint for mobile optimization.
   * Combines stats, inactive stagiaires, trends, and stagiaires progress
   * into a single API call to reduce network latency.
   */
  @Get("dashboard/home")
  async dashboardHome(@Request() req: any, @Query("days") days: number = 7) {
    const data = await this.adminService.getFormateurDashboardHome(
      req.user.id,
      days,
    );
    return this.apiResponse.success(data);
  }

  @Get("dashboard/stats")
  async dashboardStats(@Request() req: any) {
    const stats = await this.adminService.getFormateurDashboardStats(
      req.user.id,
    );
    return this.apiResponse.success(stats);
  }

  @Get("formations")
  async formations(@Request() req: any) {
    const data = await this.adminService.getFormateurFormations(req.user.id);
    return this.apiResponse.success(data);
  }

  @Get("stagiaires")
  async stagiaires(@Request() req: any) {
    console.log("[DEBUG] Controller: GET /api/formateur/stagiaires hit");
    const data = await this.adminService.getFormateurStagiaires();
    console.log(
      `[DEBUG] Controller: Service returned ${data.length} stagiaires`,
    );
    return this.apiResponse.success({ stagiaires: data });
  }

  @Get("stagiaires/online")
  async onlineStagiaires(@Request() req: any) {
    try {
      const data = await this.adminService.getFormateurOnlineStagiaires(
        req.user.id,
      );
      return this.apiResponse.success({
        stagiaires: data,
        total: data.length,
      });
    } catch (error) {
      console.error("Error fetching online stagiaires:", error);
      return this.apiResponse.success({
        stagiaires: [],
        total: 0,
      });
    }
  }

  @Get("stagiaires/inactive")
  async inactiveStagiaires(
    @Request() req,
    @Query("days") days: number = 7,
    @Query("scope") scope: string = "all",
  ) {
    const stats = await this.adminService.getFormateurInactiveStagiaires(
      req.user.id,
      days,
      scope,
    );
    console.log(
      "[DEBUG] Inactive Stagiaires Stats:",
      JSON.stringify(stats).substring(0, 500),
    );
    return this.apiResponse.success(stats);
  }

  @Get("stagiaires/never-connected")
  async neverConnected() {
    const data = await this.adminService.getNeverConnected();
    return this.apiResponse.success({ stagiaires: data });
  }

  @Get("stagiaires/performance")
  async performance(@Request() req) {
    const stats = await this.adminService.getFormateurStagiairesPerformance(
      req.user.id,
    );
    return this.apiResponse.success(stats);
  }

  @Post("stagiaires/disconnect")
  @HttpCode(200)
  async disconnect(@Body() data: { stagiaire_ids: number[] }) {
    const updatedCount = await this.adminService.disconnectStagiaires(
      data.stagiaire_ids,
    );
    return this.apiResponse.success({
      success: true,
      message: `${updatedCount} stagiaire(s) déconnecté(s)`,
      disconnected_count: updatedCount,
    });
  }

  @Get("stagiaire/:id/profile")
  async stagiaireProfile(@Param("id") id: number) {
    const data = await this.adminService.getStagiaireProfileById(id);
    return this.apiResponse.success(data);
  }

  @Get("stagiaire/:id/stats")
  async stagiaireStats(@Param("id") id: number) {
    const stats = await this.adminService.getStagiaireProfileById(id);
    if (!stats) {
      return this.apiResponse.error("Stagiaire non trouvé", 404);
    }
    return this.apiResponse.success(stats);
  }

  @Get("video/:id/stats")
  async videoStats(@Param("id") id: number) {
    return this.apiResponse.success({});
  }

  @Get("videos")
  async videos() {
    return this.apiResponse.success([]);
  }

  @Get("formations-videos")
  async getFormateurVideosByFormations(@Request() req: any) {
    const userId = req.user.id;
    const formationsWithVideos =
      await this.adminService.getFormateurFormationsWithVideos(userId);
    return this.apiResponse.success(
      formationsWithVideos,
      "Vidéos par formation récupérées avec succès",
    );
  }

  @Get("classement/formation/:formationId")
  async formationRanking(@Param("formationId") formationId: number) {
    return this.apiResponse.success([]);
  }

  @Get("classement/arena")
  async arenaRanking(
    @Query("period") period: string = "all",
    @Query("formation_id") formationId?: number,
  ) {
    const data = await this.adminService.getTrainerArenaRanking(
      period,
      formationId,
    );
    return this.apiResponse.success(data);
  }

  @Get("classement/mes-stagiaires")
  async mesStagiairesRanking(
    @Request() req,
    @Query("period") period: string = "all",
  ) {
    const data = await this.adminService.getMyStagiairesRanking(
      req.user.id,
      period,
    );
    return this.apiResponse.success(data);
  }

  @Post("send-email")
  async sendEmail(@Body() data: any) {
    return this.apiResponse.success();
  }

  @Post("send-notification")
  async sendNotification(@Request() req: any, @Body() data: any) {
    const { recipient_ids, title, body } = data;
    const result = await this.adminService.sendNotification(
      req.user.id,
      recipient_ids,
      title,
      body,
    );
    return this.apiResponse.success(result);
  }

  @Get("trends")
  async trends(@Request() req: any) {
    const data = await this.adminService.getFormateurTrends(req.user.id);
    return this.apiResponse.success(data);
  }

  // --- Analytics Routes (Consolidated) ---

  @Get("analytics/formations/performance")
  async getFormationsPerformance(@Request() req) {
    const data = await this.adminService.getFormateurFormations(req.user.id);
    return this.apiResponse.success(data);
  }

  @Get("analytics/stagiaire/:id/formations")
  async getStagiaireFormations(@Param("id") id: number) {
    const data = await this.adminService.getStagiaireFormationPerformance(id);
    return this.apiResponse.success(data);
  }

  @Get("analytics/quiz-success-rate")
  async getQuizSuccessRate(
    @Query("period") period: number = 30,
    @Query("formation_id") formationId: number,
    @Request() req,
  ) {
    const data = await this.adminService.getFormateurQuizSuccessRate(
      req.user.id,
      period,
      formationId,
    );
    return this.apiResponse.success(data);
  }

  @Get("analytics/completion-time")
  async getCompletionTime(
    @Query("period") period: number = 30,
    @Request() req,
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

  @Get("analytics/activity-heatmap")
  async getActivityHeatmap(
    @Query("period") period: number = 30,
    @Query("formation_id") formationId: number,
    @Request() req,
  ) {
    const data = await this.adminService.getFormateurActivityHeatmap(
      req.user.id,
      period,
      formationId,
    );
    return this.apiResponse.success(data);
  }

  @Get("analytics/dropout-rate")
  async getDropoutRate(
    @Query("formation_id") formationId: number,
    @Request() req,
  ) {
    const data = await this.adminService.getFormateurDropoutRate(
      req.user.id,
      formationId,
    );
    return this.apiResponse.success(data);
  }

  @Get("analytics/dashboard")
  async getDashboard(
    @Query("period") period: number = 30,
    @Query("formation_id") formationId: number,
    @Request() req,
  ) {
    const data = await this.adminService.getFormateurAnalyticsDashboard(
      req.user.id,
      period,
      formationId,
    );
    return this.apiResponse.success(data);
  }

  @Get("analytics/formations-performance")
  async getFormationsOverview(@Request() req) {
    const data = await this.adminService.getFormateurFormationsPerformance(
      req.user.id,
    );
    return this.apiResponse.success(data);
  }

  @Get("analytics/students-comparison")
  async getStudentsComparison(
    @Query("formation_id") formationId: number,
    @Request() req,
  ) {
    const data = await this.adminService.getFormateurStudentsComparison(
      req.user.id,
      formationId,
    );
    return this.apiResponse.success(data);
  }

  @Get("analytics/performance")
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

  @Get("stats/dashboard")
  async stats() {
    return this.apiResponse.success({});
  }
}

@Controller("commercial/stats")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("commercial", "commerciale")
export class CommercialApiController {
  constructor(
    private apiResponse: ApiResponseService,
    private adminService: AdminService,
  ) {}

  @Get("dashboard")
  async dashboard(@Request() req: any) {
    const data = await this.adminService.getCommercialDashboardStats();
    return this.apiResponse.success(data);
  }
}
