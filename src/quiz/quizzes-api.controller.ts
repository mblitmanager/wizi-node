import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponseService } from "../common/services/api-response.service";
import { QuizService } from "./quiz.service";

@Controller("quizzes")
@UseGuards(AuthGuard("jwt"))
export class QuizzesApiController {
  constructor(
    private quizService: QuizService,
    private apiResponse: ApiResponseService
  ) {}

  @Get(":id")
  async getById(@Param("id") id: number) {
    // Note: Returning raw JSON-LD object without success() wrapper for this specific endpoint
    return this.quizService.getQuizJsonLd(id);
  }

  @Post(":quizId/submit")
  async submit(@Param("quizId") quizId: number, @Body() data: any) {
    return this.apiResponse.success();
  }
}
