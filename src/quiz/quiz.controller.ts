import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { QuizService } from "./quiz.service";

@Controller("quiz")
export class QuizController {
  constructor(private quizService: QuizService) {}

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
