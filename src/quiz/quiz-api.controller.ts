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

@Controller("quiz")
@UseGuards(AuthGuard("jwt"))
export class QuizApiController {
  constructor(
    private rankingService: RankingService,
    private apiResponse: ApiResponseService
  ) {}

  @Get("by-formations")
  async byFormations() {
    return this.apiResponse.success({});
  }

  @Get("categories")
  async categories() {
    return this.apiResponse.success([]);
  }

  @Get("category/:categoryId")
  async byCategory() {
    return this.apiResponse.success([]);
  }

  @Get("classement/global")
  async globalClassement() {
    const data = await this.rankingService.getGlobalRanking();
    return this.apiResponse.success(data);
  }

  @Get("history")
  async history(@Request() req: any) {
    const data = await this.rankingService.getQuizHistory(req.user.id);
    return this.apiResponse.success(data);
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
    return this.apiResponse.success({});
  }

  @Post(":id/result")
  async submitResult(@Param("id") id: number, @Body() data: any) {
    return this.apiResponse.success();
  }

  @Get(":quizId/questions")
  async getQuestions(@Param("quizId") quizId: number) {
    return this.apiResponse.success([]);
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
  async getStatistics(@Param("quizId") quizId: number) {
    return this.apiResponse.success({});
  }

  @Get(":quizId/user-participations")
  async getUserParticipations(@Param("quizId") quizId: number) {
    return this.apiResponse.success([]);
  }
}
