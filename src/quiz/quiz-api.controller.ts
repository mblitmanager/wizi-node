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

@Controller("api/quiz")
@UseGuards(AuthGuard("jwt"))
export class QuizApiController {
  constructor() {}

  @Get("by-formations")
  async byFormations() {
    return { data: {}, message: "Quizzes grouped by formations" };
  }

  @Get("categories")
  async categories() {
    return { data: [], message: "Quiz categories" };
  }

  @Get("category/:categoryId")
  async byCategory() {
    return { data: [], message: "Quizzes by category" };
  }

  @Get("classement/global")
  async globalClassement() {
    return { data: [], message: "Global quiz ranking" };
  }

  @Get("history")
  async history() {
    return { data: [], message: "Quiz history" };
  }

  @Get("stats")
  async stats() {
    return { data: {}, message: "Quiz statistics" };
  }

  @Get("stats/categories")
  async statsCategories() {
    return { data: {}, message: "Category statistics" };
  }

  @Get("stats/performance")
  async statsPerformance() {
    return { data: {}, message: "Performance statistics" };
  }

  @Get("stats/progress")
  async statsProgress() {
    return { data: {}, message: "Progress statistics" };
  }

  @Get("stats/trends")
  async statsTrends() {
    return { data: {}, message: "Trends statistics" };
  }

  @Get(":id")
  async getById(@Param("id") id: number) {
    return { data: {}, message: "Quiz details" };
  }

  @Post(":id/result")
  async submitResult(@Param("id") id: number, @Body() data: any) {
    return { message: "Result submitted" };
  }

  @Get(":quizId/questions")
  async getQuestions(@Param("quizId") quizId: number) {
    return { data: [], message: "Quiz questions" };
  }

  @Post(":quizId/submit")
  async submit(@Param("quizId") quizId: number, @Body() data: any) {
    return { message: "Quiz submitted" };
  }

  @Get(":quizId/participation")
  async getParticipation(@Param("quizId") quizId: number) {
    return { data: {}, message: "Current participation" };
  }

  @Post(":quizId/participation")
  async startParticipation(@Param("quizId") quizId: number) {
    return { message: "Participation started" };
  }

  @Post(":quizId/participation/progress")
  async saveProgress(@Param("quizId") quizId: number, @Body() data: any) {
    return { message: "Progress saved" };
  }

  @Get(":quizId/participation/resume")
  async resumeParticipation(@Param("quizId") quizId: number) {
    return { data: {}, message: "Resume participation" };
  }

  @Post(":quizId/complete")
  async complete(@Param("quizId") quizId: number) {
    return { message: "Quiz completed" };
  }

  @Get(":quizId/statistics")
  async getStatistics(@Param("quizId") quizId: number) {
    return { data: {}, message: "Quiz statistics" };
  }

  @Get(":quizId/user-participations")
  async getUserParticipations(@Param("quizId") quizId: number) {
    return { data: [], message: "User participations" };
  }
}

@Controller("api/formation")
@UseGuards(AuthGuard("jwt"))
export class FormationApiController {
  constructor() {}

  @Get("categories")
  async categories() {
    return { data: [], message: "Formation categories" };
  }

  @Get("listFormation")
  async listFormation() {
    return { data: [], message: "All formations" };
  }
}

@Controller("api/formations")
@UseGuards(AuthGuard("jwt"))
export class FormationsApiController {
  constructor() {}

  @Get("categories/:categoryId")
  async byCategory() {
    return { data: [], message: "Formations by category" };
  }

  @Get("classement/summary")
  async classementSummary() {
    return { data: {}, message: "Classement summary" };
  }

  @Get(":formationId/classement")
  async classement() {
    return { data: {}, message: "Formation classement" };
  }
}

@Controller("api/catalogueFormations")
@UseGuards(AuthGuard("jwt"))
export class CatalogueFormationsApiController {
  constructor() {}

  @Get("formations")
  async formations() {
    return { data: [], message: "All catalogue formations" };
  }

  @Get("formations/:id")
  async getFormation() {
    return { data: {}, message: "Catalogue formation details" };
  }

  @Get("formations/:id/pdf")
  async getPdf() {
    return { message: "PDF download" };
  }

  @Get("stagiaire")
  async stagiaireFormations() {
    return { data: [], message: "Stagiaire catalogue formations" };
  }

  @Get("with-formations")
  async withFormations() {
    return { data: [], message: "Catalogues with formations" };
  }
}

@Controller("api/formationParrainage")
@UseGuards(AuthGuard("jwt"))
export class FormationParrainageApiController {
  constructor() {}

  @Get()
  async formations() {
    return { data: [], message: "Formation parrainage" };
  }
}

@Controller("api/medias")
@UseGuards(AuthGuard("jwt"))
export class MediasApiController {
  constructor() {}

  @Get("astuces")
  async astuces() {
    return { data: [], message: "Astuces" };
  }

  @Get("tutoriels")
  async tutoriels() {
    return { data: [], message: "Tutoriels" };
  }

  @Get("formations-with-status")
  async formationsWithStatus() {
    return { data: [], message: "Formations with watched status" };
  }

  @Get("formations/interactives")
  async interactiveFormations() {
    return { data: [], message: "Interactive formations" };
  }

  @Get("formations/:formationId/astuces")
  async astucesByFormation() {
    return { data: [], message: "Astuces by formation" };
  }

  @Get("formations/:formationId/tutoriels")
  async tutorielsByFormation() {
    return { data: [], message: "Tutoriels by formation" };
  }

  @Get("server")
  async serverVideos() {
    return { data: [], message: "Server videos" };
  }

  @Post("upload-video")
  async uploadVideo(@Body() data: any) {
    return { message: "Video uploaded" };
  }

  @Post(":mediaId/watched")
  async markAsWatched() {
    return { message: "Marked as watched" };
  }
}

@Controller("api/media")
@UseGuards(AuthGuard("jwt"))
export class MediaApiController {
  constructor() {}

  @Get("stream/:path")
  async stream() {
    return { message: "Stream video" };
  }

  @Get("subtitle/:path")
  async subtitle() {
    return { message: "Stream subtitle" };
  }
}
