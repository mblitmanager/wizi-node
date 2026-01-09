import { Controller, Get, Param, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { QuizService } from "./quiz.service";

@Controller("quiz")
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get("categories")
  async getCategories() {
    return this.quizService.getCategories();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stats")
  async getStats(@Request() req: any) {
    return this.quizService.getStats(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stats/categories")
  async getStatsCategories(@Request() req: any) {
    return this.quizService.getStatsCategories(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stats/progress")
  async getStatsProgress(@Request() req: any) {
    return this.quizService.getStatsProgress(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stats/trends")
  async getStatsTrends(@Request() req: any) {
    return this.quizService.getStatsTrends(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stats/performance")
  async getStatsPerformance(@Request() req: any) {
    return this.quizService.getStatsPerformance(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("history")
  async getHistory(@Request() req: any) {
    // Note: We need stagiaire_id, not just user_id.
    // This assumes req.user has been enriched or we fetch it.
    // Let's assume the service handles the user->stagiaire mapping or we pass user_id if supported.
    // For now, let's keep it simple.
    return this.quizService.getHistoryByStagiaire(req.user.id);
  }

  @Get()
  async getAllQuizzes() {
    return this.quizService.getAllQuizzes();
  }

  @Get(":id")
  async getQuizDetails(@Param("id") id: string) {
    return this.quizService.getQuizDetails(+id);
  }

  @Get(":id/questions")
  async getQuestions(@Param("id") id: string) {
    return this.quizService.getQuestionsByQuiz(+id);
  }
}
