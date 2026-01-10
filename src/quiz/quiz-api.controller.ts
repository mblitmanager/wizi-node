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

@Controller("api/quiz")
@UseGuards(AuthGuard("jwt"))
export class QuizApiController {
  constructor(private apiResponse: ApiResponseService) {}

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
    return this.apiResponse.success([]);
  }

  @Get("history")
  async history() {
    return this.apiResponse.success([]);
  }

  @Get("stats")
  async stats() {
    return this.apiResponse.success({});
  }

  @Get("stats/categories")
  async statsCategories() {
    return this.apiResponse.success({});
  }

  @Get("stats/performance")
  async statsPerformance() {
    return this.apiResponse.success({});
  }

  @Get("stats/progress")
  async statsProgress() {
    return this.apiResponse.success({});
  }

  @Get("stats/trends")
  async statsTrends() {
    return this.apiResponse.success({});
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

@Controller("api/formation")
@UseGuards(AuthGuard("jwt"))
export class FormationApiController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get("categories")
  async categories() {
    return this.apiResponse.success([]);
  }

  @Get("listFormation")
  async listFormation() {
    return this.apiResponse.success([]);
  }
}

@Controller("api/formations")
@UseGuards(AuthGuard("jwt"))
export class FormationsApiController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get("categories/:categoryId")
  async byCategory() {
    return this.apiResponse.success([]);
  }

  @Get("classement/summary")
  async classementSummary() {
    return this.apiResponse.success({});
  }

  @Get(":formationId/classement")
  async classement() {
    return this.apiResponse.success({});
  }
}

@Controller("api/catalogueFormations")
@UseGuards(AuthGuard("jwt"))
export class CatalogueFormationsApiController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get("formations")
  async formations() {
    return this.apiResponse.success([]);
  }

  @Get("formations/:id")
  async getFormation() {
    return this.apiResponse.success({});
  }

  @Get("formations/:id/pdf")
  async getPdf() {
    return this.apiResponse.success();
  }

  @Get("stagiaire")
  async stagiaireFormations() {
    return this.apiResponse.success([]);
  }

  @Get("with-formations")
  async withFormations() {
    return this.apiResponse.success([]);
  }
}

@Controller("api/formationParrainage")
@UseGuards(AuthGuard("jwt"))
export class FormationParrainageApiController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get()
  async formations() {
    return this.apiResponse.success([]);
  }
}

@Controller("api/medias")
@UseGuards(AuthGuard("jwt"))
export class MediasApiController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get("astuces")
  async astuces() {
    return this.apiResponse.success([]);
  }

  @Get("tutoriels")
  async tutoriels() {
    return this.apiResponse.success([]);
  }

  @Get("formations-with-status")
  async formationsWithStatus() {
    return this.apiResponse.success([]);
  }

  @Get("formations/interactives")
  async interactiveFormations() {
    return this.apiResponse.success([]);
  }

  @Get("formations/:formationId/astuces")
  async astucesByFormation() {
    return this.apiResponse.success([]);
  }

  @Get("formations/:formationId/tutoriels")
  async tutorielsByFormation() {
    return this.apiResponse.success([]);
  }

  @Get("server")
  async serverVideos() {
    return this.apiResponse.success([]);
  }

  @Post("upload-video")
  async uploadVideo(@Body() data: any) {
    return this.apiResponse.success();
  }

  @Post(":mediaId/watched")
  async markAsWatched() {
    return this.apiResponse.success();
  }
}

@Controller("api/media")
@UseGuards(AuthGuard("jwt"))
export class MediaApiController {
  constructor(private apiResponse: ApiResponseService) {}

  @Get("stream/:path")
  async stream() {
    return this.apiResponse.success();
  }

  @Get("subtitle/:path")
  async subtitle() {
    return this.apiResponse.success();
  }
}
