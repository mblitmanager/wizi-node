import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Response,
  Query,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Quiz } from "../entities/quiz.entity";
import { Formation } from "../entities/formation.entity";
import { Achievement } from "../entities/achievement.entity";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("admin")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminDashboardController {
  constructor(
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>,
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    private apiResponse: ApiResponseService
  ) {}

  @Get("stats/dashboard-api")
  async getStatsDashboard(@Query("period") period: string = "30d") {
    // Parse period (30d, 7d, 1m, 3m, etc.)
    let daysBack = 30;
    if (period.includes("d")) {
      daysBack = parseInt(period.replace("d", ""));
    } else if (period.includes("m")) {
      daysBack = parseInt(period.replace("m", "")) * 30;
    }

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - daysBack);

    const totalStagiaires = await this.stagiaireRepository.count();
    const totalQuizzes = await this.quizRepository.count();
    const totalFormations = await this.formationRepository.count();
    const totalAchievements = await this.achievementRepository.count();

    const newStagiaires = await this.stagiaireRepository
      .createQueryBuilder("s")
      .where("s.created_at >= :date", { date: dateFrom })
      .getCount();

    const newQuizzes = await this.quizRepository
      .createQueryBuilder("q")
      .where("q.created_at >= :date", { date: dateFrom })
      .getCount();

    return this.apiResponse.success({
      stats: {
        total_stagiaires: totalStagiaires,
        total_quizzes: totalQuizzes,
        total_formations: totalFormations,
        total_achievements: totalAchievements,
        new_stagiaires: newStagiaires,
        new_quizzes: newQuizzes,
      },
      charts: {
        stagiaires_trend: await this.getStagiairesTrendByPeriod(daysBack),
        quizzes_trend: await this.getQuizzesTrendByPeriod(daysBack),
        top_formations: await this.getTopFormations(),
      },
      recent_activity: await this.getRecentActivity(),
    });
  }

  @Get("dashboard")
  async getDashboardStats(@Request() req: any) {
    const totalStagiaires = await this.stagiaireRepository.count();
    const totalQuizzes = await this.quizRepository.count();
    const totalFormations = await this.formationRepository.count();
    const totalAchievements = await this.achievementRepository.count();

    // Récent (7 derniers jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentStagiaires = await this.stagiaireRepository
      .createQueryBuilder("s")
      .where("s.created_at >= :date", { date: sevenDaysAgo })
      .getCount();

    const recentQuizzes = await this.quizRepository
      .createQueryBuilder("q")
      .where("q.created_at >= :date", { date: sevenDaysAgo })
      .getCount();

    return this.apiResponse.success({
      stats: {
        total_stagiaires: totalStagiaires,
        total_quizzes: totalQuizzes,
        total_formations: totalFormations,
        total_achievements: totalAchievements,
        recent_stagiaires: recentStagiaires,
        recent_quizzes: recentQuizzes,
      },
      charts: {
        stagiaires_trend: await this.getStagiairesTrend(),
        quizzes_trend: await this.getQuizzesTrend(),
        top_formations: await this.getTopFormations(),
      },
      recent_activity: await this.getRecentActivity(),
    });
  }

  private async getStagiairesTrend() {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    return this.stagiaireRepository
      .createQueryBuilder("s")
      .select("DATE(s.created_at) as date, COUNT(*) as count")
      .where("s.created_at >= :date", { date: lastMonth })
      .groupBy("DATE(s.created_at)")
      .getRawMany();
  }

  private async getStagiairesTrendByPeriod(daysBack: number) {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - daysBack);

    return this.stagiaireRepository
      .createQueryBuilder("s")
      .select("DATE(s.created_at) as date, COUNT(*) as count")
      .where("s.created_at >= :date", { date: dateFrom })
      .groupBy("DATE(s.created_at)")
      .getRawMany();
  }

  private async getQuizzesTrend() {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    return this.quizRepository
      .createQueryBuilder("q")
      .select("DATE(q.created_at) as date, COUNT(*) as count")
      .where("q.created_at >= :date", { date: lastMonth })
      .groupBy("DATE(q.created_at)")
      .getRawMany();
  }

  private async getQuizzesTrendByPeriod(daysBack: number) {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - daysBack);

    return this.quizRepository
      .createQueryBuilder("q")
      .select("DATE(q.created_at) as date, COUNT(*) as count")
      .where("q.created_at >= :date", { date: dateFrom })
      .groupBy("DATE(q.created_at)")
      .getRawMany();
  }

  private async getTopFormations() {
    return this.formationRepository
      .createQueryBuilder("f")
      .select("f.titre as titre, COUNT(p.id) as count")
      .leftJoin("f.progressions", "p")
      .groupBy("f.id")
      .orderBy("count", "DESC")
      .take(5)
      .getRawMany();
  }

  private async getRecentActivity() {
    const recentStagiaires = await this.stagiaireRepository.find({
      order: { created_at: "DESC" },
      take: 5,
      relations: ["user"],
    });

    const recentQuizzes = await this.quizRepository.find({
      order: { created_at: "DESC" },
      take: 5,
    });

    return {
      recent_stagiaires: recentStagiaires,
      recent_quizzes: recentQuizzes,
    };
  }
}
