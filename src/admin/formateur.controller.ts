import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { ApiResponseService } from "../common/services/api-response.service";
import { AdminService } from "./admin.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { Question } from "../entities/question.entity";
import { Reponse } from "../entities/reponse.entity";
import { Formation } from "../entities/formation.entity";
import { Formateur } from "../entities/formateur.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";

@Controller("formateur")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("formateur", "formatrice")
export class FormateurController {
  constructor(
    private adminService: AdminService,
    private apiResponse: ApiResponseService,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Reponse)
    private reponseRepository: Repository<Reponse>,
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>,
    @InjectRepository(Formateur)
    private formateurRepository: Repository<Formateur>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(QuizParticipation)
    private quizParticipationRepository: Repository<QuizParticipation>,
    @InjectRepository(CatalogueFormation)
    private catalogueFormationRepository: Repository<CatalogueFormation>,
  ) {}

  // --- Dashboard & General Stats ---

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

  @Get("trends")
  async trends(@Request() req: any) {
    const data = await this.adminService.getFormateurTrends(req.user.id);
    return this.apiResponse.success(data);
  }

  @Get("alerts")
  async getAlerts(@Request() req: any) {
    // Ported from FormateurAlertsController
    const formateur = await this.formateurRepository.findOne({
      where: { user_id: req.user.id },
      relations: ["stagiaires", "stagiaires.user"],
    });

    const alerts: any[] = [];
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    if (!formateur) return this.apiResponse.success({ alerts: [] });

    // 1. Inactive Students
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    for (const stagiaire of formateur.stagiaires) {
      if (!stagiaire.statut) continue;

      const lastActivity = stagiaire.user?.last_activity_at;
      const isInactive = !lastActivity || new Date(lastActivity) < weekAgo;

      if (isInactive) {
        alerts.push({
          id: `inactive_${stagiaire.id}`,
          type: "warning",
          category: "inactivity",
          title: "Stagiaire inactif",
          message: `${stagiaire.prenom} ${stagiaire.user?.name || ""} n'a pas eu d'activité depuis 7 jours`,
          stagiaire_id: stagiaire.id,
          stagiaire_name: `${stagiaire.prenom} ${stagiaire.user?.name || ""}`,
          priority: "medium",
          created_at: new Date().toISOString(),
        });
      }
    }

    // 2. Approaching Deadlines
    for (const stagiaire of formateur.stagiaires) {
      if (!stagiaire.date_fin_formation) continue;
      const deadline = new Date(stagiaire.date_fin_formation);
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

      if (daysLeft >= 0 && daysLeft <= 7) {
        alerts.push({
          id: `deadline_${stagiaire.id}`,
          type: "info",
          category: "deadline",
          title: "Fin de formation proche",
          message: `La formation de ${stagiaire.prenom} se termine dans ${daysLeft} jour(s)`,
          stagiaire_id: stagiaire.id,
          stagiaire_name: `${stagiaire.prenom} ${stagiaire.user?.name || ""}`,
          days_left: daysLeft,
          priority: daysLeft <= 3 ? "high" : "medium",
          created_at: new Date().toISOString(),
        });
      }
    }

    alerts.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
    );

    return this.apiResponse.success({
      alerts,
      total_count: alerts.length,
      high_priority_count: alerts.filter((a) => a.priority === "high").length,
    });
  }

  // --- Stagiaires Management ---

  @Get("stagiaires")
  async stagiaires(@Request() req: any) {
    const data = await this.adminService.getFormateurStagiaires(req.user.id);
    return this.apiResponse.success({ stagiaires: data });
  }

  @Get("stagiaires/online")
  async onlineStagiaires(@Request() req: any) {
    const data = await this.adminService.getFormateurOnlineStagiaires(
      req.user.id,
    );
    return this.apiResponse.success({ stagiaires: data, total: data.length });
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
    return this.apiResponse.success(stats);
  }

  @Get("stagiaire/:id/stats")
  @Get("stagiaire/:id/profile")
  async stagiaireStats(@Param("id") id: number) {
    const stats = await this.adminService.getStagiaireProfileById(id);
    if (!stats)
      throw new HttpException("Stagiaire non trouvé", HttpStatus.NOT_FOUND);
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
    });
  }

  // --- Quizzes Management ---

  @Get("quizzes")
  async quizzes(
    @Query("formation_id") formationId?: number,
    @Query("status") status?: string,
    @Query("search") search?: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const queryBuilder = this.quizRepository
      .createQueryBuilder("quiz")
      .leftJoinAndSelect("quiz.formation", "formation")
      .leftJoinAndSelect("quiz.questions", "questions");

    if (formationId) {
      // FIX: The frontend might send a CatalogueFormation ID (from the trainer's list).
      // We must check if this ID corresponds to a CatalogueFormation and use its real `formation_id`
      // for filtering Quizzes (which are linked to content).
      const legacyCatalogueFormation =
        await this.catalogueFormationRepository.findOne({
          where: { id: formationId },
          select: ["id", "formation_id"],
        });

      if (legacyCatalogueFormation && legacyCatalogueFormation.formation_id) {
        // It matches a CatalogueFormation, use the real content ID
        queryBuilder.andWhere("quiz.formation_id = :formationId", {
          formationId: legacyCatalogueFormation.formation_id,
        });
      } else {
        // Fallback: Use the provided ID as is (direct Formation ID)
        queryBuilder.andWhere("quiz.formation_id = :formationId", {
          formationId,
        });
      }
    }
    if (status) {
      queryBuilder.andWhere("quiz.status = :status", { status });
    }
    if (search) {
      queryBuilder.andWhere(
        "(quiz.titre LIKE :search OR quiz.description LIKE :search)",
        { search: `%${search}%` },
      );
    }

    const [items, total] = await queryBuilder
      .orderBy("quiz.created_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data = items.map((q) => ({
      id: q.id,
      titre: q.titre,
      description: q.description,
      niveau: q.niveau,
      duree: q.duree,
      status: q.status,
      formation_id: q.formation_id, // CRITICAL FOR FILTERS
      formation: q.formation
        ? {
            id: q.formation.id,
            nom: q.formation.titre,
            title: q.formation.titre,
          }
        : null,
      nb_questions: q.questions?.length || 0,
      created_at: q.created_at,
    }));

    return this.apiResponse.success({
      data,
      meta: {
        total,
        page: Number(page),
        last_page: Math.ceil(total / limit),
      },
      quizzes: data, // Keep legacy key for compatibility during migration
    });
  }

  @Get("quizzes/:id")
  async quizDetail(@Param("id") id: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ["questions", "questions.reponses", "formation"],
    });

    if (!quiz) throw new HttpException("Quiz non trouvé", HttpStatus.NOT_FOUND);

    const questions = (quiz.questions || []).map((q) => ({
      id: q.id,
      question: q.text,
      type: q.type,
      reponses: (q.reponses || []).map((r) => ({
        id: r.id,
        reponse: r.text,
        correct: !!r.isCorrect,
      })),
    }));

    return this.apiResponse.success({
      quiz: {
        id: quiz.id,
        titre: quiz.titre,
        description: quiz.description,
        niveau: quiz.niveau,
        duree: quiz.duree,
        status: quiz.status,
        formation_id: quiz.formation_id,
        formation: quiz.formation
          ? { id: quiz.formation.id, nom: quiz.formation.titre }
          : null,
      },
      questions,
    });
  }

  @Post("quizzes")
  async storeQuiz(@Body() data: any) {
    const quiz = this.quizRepository.create({
      titre: data.titre,
      description: data.description,
      duree: data.duree,
      niveau: data.niveau,
      formation_id: data.formation_id,
      status: data.status || "brouillon",
      nb_points_total: "0",
    });
    await this.quizRepository.save(quiz);
    return this.apiResponse.success({ quiz }, "Quiz créé avec succès");
  }

  @Post("quizzes/:id/publish")
  async publishQuiz(@Param("id") id: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ["questions"],
    });
    if (!quiz) throw new HttpException("Quiz non trouvé", HttpStatus.NOT_FOUND);
    if ((quiz.questions?.length || 0) === 0)
      throw new HttpException("Quiz sans questions", HttpStatus.BAD_REQUEST);

    quiz.status = "actif";
    await this.quizRepository.save(quiz);
    return this.apiResponse.success(null, "Quiz publié");
  }

  @Delete("quizzes/:id")
  async deleteQuiz(@Param("id") id: number) {
    const quiz = await this.quizRepository.findOne({ where: { id } });
    if (!quiz) throw new HttpException("Quiz non trouvé", HttpStatus.NOT_FOUND);
    await this.quizRepository.remove(quiz);
    return this.apiResponse.success(null, "Quiz supprimé");
  }

  @Post("quizzes/:id/questions")
  async addQuestion(@Param("id") id: number, @Body() data: any) {
    const question = this.questionRepository.create({
      quiz_id: id,
      text: data.question,
      type: data.type || "qcm",
      points: "1",
    });
    await this.questionRepository.save(question);

    if (data.reponses) {
      for (const r of data.reponses) {
        const reponse = this.reponseRepository.create({
          question_id: question.id,
          text: r.reponse,
          isCorrect: !!r.correct,
        });
        await this.reponseRepository.save(reponse);
      }
    }
    return this.apiResponse.success(question, "Question ajoutée");
  }

  @Delete("quizzes/:quizId/questions/:questionId")
  async deleteQuestion(
    @Param("quizId") quizId: number,
    @Param("questionId") questionId: number,
  ) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId, quiz_id: quizId },
    });
    if (!question)
      throw new HttpException("Question non trouvée", HttpStatus.NOT_FOUND);
    await this.questionRepository.remove(question);
    return this.apiResponse.success(null, "Question supprimée");
  }

  // --- Formations & Videos ---

  @Get("formations")
  async formations(@Request() req: any) {
    const data = await this.adminService.getFormateurFormations(req.user.id);
    return this.apiResponse.success(data);
  }

  @Get("formations/:id/stagiaires")
  async formationStagiaires(@Request() req: any, @Param("id") id: number) {
    const data = await this.adminService.getFormateurFormationStagiaires(
      req.user.id,
      id,
    );
    return this.apiResponse.success(data);
  }

  @Post("formations/:id/assign")
  async assignFormation(
    @Request() req: any,
    @Param("id") id: number,
    @Body() body: any,
  ) {
    const { stagiaire_ids, date_debut, date_fin } = body;
    const result = await this.adminService.assignFormateurFormationStagiaires(
      req.user.id,
      id,
      stagiaire_ids,
      date_debut,
      date_fin,
    );
    return this.apiResponse.success(result);
  }

  @Get("formations-videos")
  async formationsVideos(@Request() req: any) {
    const data = await this.adminService.getFormateurFormationsWithVideos(
      req.user.id,
    );
    return this.apiResponse.success(data);
  }

  @Get("formations-list")
  async formationsList() {
    const formations = await this.formationRepository.find({
      select: ["id", "titre"],
      order: { titre: "ASC" },
    });
    return this.apiResponse.success({ formations });
  }

  @Get("video/:id/stats")
  async videoStats(@Param("id") id: number) {
    const stats = await this.adminService.getVideoStats(id);
    return this.apiResponse.success(stats);
  }

  // --- Ranking & Analytics ---

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

  @Get("analytics/formations/performance")
  async formationsPerformanceSlash(@Request() req) {
    return this.formationsPerformance(req);
  }

  @Get("analytics/performance")
  @Get("analytics/performance")
  async formationsPerformance(@Request() req) {
    const performance = await this.adminService.getFormateurStudentsPerformance(
      req.user.id,
    );

    // Calculate rankings based on the performance data
    const mostQuizzes = [...performance]
      .sort((a, b) => b.total_quizzes - a.total_quizzes)
      .slice(0, 3);
    const mostActive = [...performance]
      .sort((a, b) => b.total_logins - a.total_logins)
      .slice(0, 3);

    return this.apiResponse.success({
      performance,
      rankings: {
        most_quizzes: mostQuizzes,
        most_active: mostActive,
      },
    });
  }

  @Get("analytics/formations-performance")
  async formationsPerformanceLegacy(@Request() req) {
    const data = await this.adminService.getFormateurFormationsPerformance(
      req.user.id,
    );
    return this.apiResponse.success(data);
  }

  @Get("analytics/dashboard")
  async analyticsDashboard(
    @Request() req,
    @Query("period") period: number = 30,
    @Query("formation_id") formationId?: number,
  ) {
    const data = await this.adminService.getFormateurAnalyticsDashboard(
      req.user.id,
      period,
      formationId,
    );
    return this.apiResponse.success(data);
  }

  @Get("analytics/quiz-success-rate")
  async quizSuccessRate(
    @Request() req: any,
    @Query("period") period: number = 30,
    @Query("formation_id") formationId?: number,
  ) {
    const data = await this.adminService.getFormateurQuizSuccessRate(
      req.user.id,
      period,
      formationId,
    );
    return this.apiResponse.success(data);
  }

  @Get("analytics/completion-time")
  async completionTime() {
    return this.apiResponse.success({ completion_trends: [] });
  }

  @Get("analytics/activity-heatmap")
  async activityHeatmap(
    @Request() req: any,
    @Query("period") period: number = 30,
    @Query("formation_id") formationId?: number,
  ) {
    const data = await this.adminService.getFormateurActivityHeatmap(
      req.user.id,
      period,
      formationId,
    );
    return this.apiResponse.success(data);
  }

  @Get("analytics/dropout-rate")
  async dropoutRate(
    @Request() req: any,
    @Query("formation_id") formationId?: number,
  ) {
    const data = await this.adminService.getFormateurDropoutRate(
      req.user.id,
      formationId,
    );
    return this.apiResponse.success(data);
  }

  // --- Notifications & Messaging ---

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
}
