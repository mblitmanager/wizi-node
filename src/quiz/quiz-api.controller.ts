import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponseService } from "../common/services/api-response.service";
import { RankingService } from "../ranking/ranking.service";
import { QuizService } from "./quiz.service";
import { AchievementService } from "../achievement/achievement.service";

@Controller("quiz")
@UseGuards(AuthGuard("jwt"))
export class QuizApiController {
  constructor(
    private rankingService: RankingService,
    private quizService: QuizService,
    private apiResponse: ApiResponseService,
    private achievementService: AchievementService
  ) {}

  @Get()
  async getAll() {
    const data = await this.quizService.getAllQuizzes();
    return this.apiResponse.success(data);
  }

  @Get("by-formations")
  async byFormations(@Request() req: any) {
    const stagiaireId = req.user?.stagiaire?.id;
    return this.quizService.getQuizzesByFormation(stagiaireId);
  }

  @Get("categories")
  async categories(@Request() req: any) {
    const userId = req.user?.id;
    const data = await this.quizService.getCategories(userId);
    return this.apiResponse.success(data);
  }

  @Get("history")
  async history(@Request() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      return this.apiResponse.error("User not found", 401);
    }

    const data = await this.quizService.getQuizHistory(userId);
    return data; // Return the array directly, without wrapping in success()
  }

  @Get("category/:categoryId")
  async byCategory(
    @Param("categoryId") categoryId: string,
    @Request() req: any
  ) {
    const stagiaireId = req.user.stagiaire?.id;
    if (!stagiaireId) {
      return this.apiResponse.success([]);
    }
    const data = await this.quizService.getQuizzesByCategory(
      categoryId,
      stagiaireId
    );
    return this.apiResponse.success(data);
  }

  @Get("classement/global")
  async globalClassement(
    @Query("period") period: string = "all",
    @Query("quarter") quarter?: string
  ) {
    const data = await this.rankingService.getGlobalRanking(period, quarter);
    // Note: Returning raw list without success() wrapper for parity
    return data.map(({ level, ...item }) => item);
  }

  @Get("stats")
  async stats(@Request() req: any) {
    const data = await this.rankingService.getQuizStats(req.user.id);
    return this.apiResponse.success(data);
  }

  @Get("stats/categories")
  async statsCategories(@Request() req: any) {
    const data = await this.rankingService.getCategoryStats(req.user.id);
    return this.apiResponse.success(data);
  }

  @Get("stats/progress")
  async statsProgress(@Request() req: any) {
    const data = await this.rankingService.getProgressStats(req.user.id);
    return this.apiResponse.success(data);
  }

  @Get("stats/performance")
  async statsPerformance() {
    // Laravel returns: { strengths: [...], weaknesses: [...], improvement_areas: [...] }
    return this.apiResponse.success({
      strengths: [], // { category_id: "...", category_name: "...", score: 85 }
      weaknesses: [],
      improvement_areas: [],
    });
  }

  @Get("stats/trends")
  async statsTrends() {
    // Laravel returns: { category_trends: [...], overall_trend: [...] }
    return this.apiResponse.success({
      category_trends: [], // { category_id: "...", category_name: "...", trend_data: [{ date: "...", score: 80 }] }
      overall_trend: [], // { date: "...", average_score: 78 }
    });
  }

  @Get(":id")
  async getById(@Param("id") id: number) {
    const data = await this.quizService.getQuizDetails(id);
    return this.apiResponse.success(data);
  }

  @Get(":id/result")
  async getResult(@Param("id") id: number, @Request() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      return this.apiResponse.error("User not found", 401);
    }

    // Get the latest participation for this user and quiz
    const participation = await this.quizService.getLatestParticipation(
      id,
      userId
    );

    if (!participation) {
      return this.apiResponse.error("No quiz result found", 404);
    }

    return this.apiResponse.success(participation);
  }

  @Post(":id/result")
  async submitResult(
    @Param("id") id: number,
    @Body() body: any,
    @Request() req: any
  ) {
    const stagiaireId = req.user.stagiaire?.id;
    if (!stagiaireId) {
      return this.apiResponse.error("Stagiaire not found", 404);
    }
    const data = await this.quizService.submitQuizResult(
      id,
      req.user.id,
      stagiaireId,
      body.answers || {},
      body.timeSpent || 0
    );

    // Check for achievements
    const newAchievements = await this.achievementService.checkAchievements(
      stagiaireId,
      id
    );

    return this.apiResponse.success({
      ...data,
      new_achievements: newAchievements,
    });
  }

  @Get(":quizId/questions")
  async getQuestions(@Param("quizId") quizId: number) {
    const data = await this.quizService.getQuestionsByQuiz(quizId);
    return this.apiResponse.success(data);
  }

  @Post(":quizId/submit")
  async submit(@Param("quizId") quizId: number, @Body() data: any) {
    return this.apiResponse.success();
  }

  @Get(":quizId/participation")
  async getParticipation(@Param("quizId") quizId: number) {
    return this.apiResponse.success({});
  }

  @Post(":quizId/participation")
  async startParticipation(@Param("quizId") quizId: number) {
    return this.apiResponse.success();
  }

  @Post(":quizId/participation/progress")
  async saveProgress(@Param("quizId") quizId: number, @Body() data: any) {
    return this.apiResponse.success();
  }

  @Get(":quizId/participation/resume")
  async resumeParticipation(@Param("quizId") quizId: number) {
    return this.apiResponse.success({});
  }

  @Post(":quizId/complete")
  async complete(@Param("quizId") quizId: number) {
    return this.apiResponse.success();
  }

  @Get(":quizId/statistics")
  async getStatistics(@Param("quizId") quizId: number, @Request() req: any) {
    const stagiaireId = req.user.stagiaire?.id;
    if (!stagiaireId) {
      return this.apiResponse.success({});
    }
    const data = await this.quizService.getQuizStatistics(quizId, stagiaireId);
    return this.apiResponse.success(data);
  }

  @Get(":quizId/user-participations")
  async getUserParticipations(@Param("quizId") quizId: number) {
    return this.apiResponse.success([]);
  }
}
