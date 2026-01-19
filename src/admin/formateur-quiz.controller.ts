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
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { ApiResponseService } from "../common/services/api-response.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { Question } from "../entities/question.entity";
import { Reponse } from "../entities/reponse.entity";
import { Formation } from "../entities/formation.entity";

@Controller("formateur")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("formateur", "formatrice")
export class FormateurQuizController {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Reponse)
    private reponseRepository: Repository<Reponse>,
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>,
    private apiResponse: ApiResponseService
  ) {}

  @Get("quizzes")
  async index(@Query() query: any) {
    const queryBuilder = this.quizRepository
      .createQueryBuilder("quiz")
      .leftJoinAndSelect("quiz.questions", "questions")
      .leftJoinAndSelect("quiz.formation", "formation");

    if (query.formation_id) {
      queryBuilder.where("quiz.formation_id = :formationId", {
        formationId: query.formation_id,
      });
    }

    if (query.status) {
      queryBuilder.andWhere("quiz.status = :status", { status: query.status });
    }

    const quizzes = await queryBuilder
      .orderBy("quiz.created_at", "DESC")
      .getMany();

    const quizzesData = quizzes.map((quiz: any) => ({
      id: quiz.id,
      titre: quiz.titre,
      description: quiz.description,
      duree: quiz.duree,
      niveau: quiz.niveau,
      nb_points_total: quiz.nb_points_total,
      status: quiz.status || "actif",
      formation: quiz.formation
        ? {
            id: quiz.formation.id,
            nom: quiz.formation.titre,
          }
        : null,
      nb_questions: quiz.questions?.length || 0,
      created_at: quiz.created_at,
    }));

    return this.apiResponse.success({ quizzes: quizzesData });
  }

  @Get("quizzes/:id")
  async show(@Param("id") id: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ["questions", "questions.reponses", "formation"],
    });

    if (!quiz) {
      throw new HttpException("Quiz non trouvé", HttpStatus.NOT_FOUND);
    }

    const questionsData = (quiz.questions || [])
      .map((question: any) => ({
        id: question.id,
        question: question.text,
        type: question.type || "qcm",
        ordre: question.ordre || 0,
        reponses: (question.reponses || []).map((reponse: any) => ({
          id: reponse.id,
          reponse: reponse.text,
          correct: !!reponse.isCorrect,
        })),
      }))
      .sort((a, b) => a.ordre - b.ordre);

    return this.apiResponse.success({
      quiz: {
        id: quiz.id,
        titre: quiz.titre,
        description: quiz.description,
        duree: quiz.duree,
        niveau: quiz.niveau,
        nb_points_total: quiz.nb_points_total,
        status: quiz.status,
        nb_questions: quiz.questions?.length || 0,
        formation_id: quiz.formation_id,
        formation_nom: quiz.formation?.titre,
        formation: quiz.formation
          ? {
              id: quiz.formation.id,
              nom: quiz.formation.titre,
            }
          : null,
      },
      questions: questionsData,
    });
  }

  @Post("quizzes")
  async store(@Body() data: any) {
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

    return this.apiResponse.success(
      {
        success: true,
        message: "Quiz créé avec succès",
        quiz: {
          id: quiz.id,
          titre: quiz.titre,
          status: quiz.status,
        },
      },
      "Quiz créé avec succès"
    );
  }

  @Put("quizzes/:id")
  async update(@Param("id") id: number, @Body() data: any) {
    const quiz = await this.quizRepository.findOne({ where: { id } });

    if (!quiz) {
      throw new HttpException("Quiz non trouvé", HttpStatus.NOT_FOUND);
    }

    Object.assign(quiz, {
      titre: data.titre || quiz.titre,
      description:
        data.description !== undefined ? data.description : quiz.description,
      duree: data.duree || quiz.duree,
      niveau: data.niveau || quiz.niveau,
      formation_id:
        data.formation_id !== undefined ? data.formation_id : quiz.formation_id,
      status: data.status || quiz.status,
    });

    await this.quizRepository.save(quiz);

    return this.apiResponse.success({
      success: true,
      message: "Quiz mis à jour",
      quiz: {
        id: quiz.id,
        titre: quiz.titre,
      },
    });
  }

  @Delete("quizzes/:id")
  async destroy(@Param("id") id: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ["quiz_participations"],
    });

    if (!quiz) {
      throw new HttpException("Quiz non trouvé", HttpStatus.NOT_FOUND);
    }

    if ((quiz as any).quiz_participations?.length > 0) {
      throw new HttpException(
        "Impossible de supprimer un quiz avec des participations. Archivez-le plutôt.",
        HttpStatus.BAD_REQUEST
      );
    }

    await this.quizRepository.remove(quiz);

    return this.apiResponse.success(
      {
        success: true,
        message: "Quiz supprimé",
      },
      "Quiz supprimé avec succès"
    );
  }

  @Post(":id/questions")
  async addQuestion(@Param("id") id: number, @Body() data: any) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ["questions"],
    });

    if (!quiz) {
      throw new HttpException("Quiz non trouvé", HttpStatus.NOT_FOUND);
    }

    const hasCorrect = data.reponses.some((r: any) => r.correct);
    if (!hasCorrect) {
      throw new HttpException(
        "Au moins une réponse doit être correcte",
        HttpStatus.BAD_REQUEST
      );
    }

    const question = this.questionRepository.create({
      quiz_id: quiz.id,
      text: data.question,
      type: data.type || "qcm",
      points: 1, // Default points
      // ordre handled by defaults or DB
    });

    await this.questionRepository.save(question);

    for (const reponseData of data.reponses) {
      const reponse = this.reponseRepository.create({
        question_id: question.id,
        text: reponseData.reponse,
        isCorrect: reponseData.correct ? true : false,
      });
      await this.reponseRepository.save(reponse);
    }

    const points = ((quiz.questions?.length || 0) + 1) * 2;
    quiz.nb_points_total = points.toString();
    await this.quizRepository.save(quiz);

    return this.apiResponse.success(
      {
        success: true,
        message: "Question ajoutée",
        question: {
          id: question.id,
          question: question.text,
        },
      },
      "Question ajoutée avec succès"
    );
  }

  @Put("quizzes/:quizId/questions/:questionId")
  async updateQuestion(
    @Param("quizId") quizId: number,
    @Param("questionId") questionId: number,
    @Body() data: any
  ) {
    const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
    const question = await this.questionRepository.findOne({
      where: { id: questionId, quiz_id: quizId },
    });

    if (!quiz || !question) {
      throw new HttpException(
        "Quiz ou question non trouvé",
        HttpStatus.NOT_FOUND
      );
    }

    if (data.question) {
      question.text = data.question;
    }
    if (data.type) {
      question.type = data.type;
    }

    await this.questionRepository.save(question);

    if (data.reponses) {
      await this.reponseRepository.delete({ question_id: questionId });

      for (const r of data.reponses) {
        const reponse = this.reponseRepository.create({
          question_id: question.id,
          text: r.reponse,
          isCorrect: r.correct ? true : false,
        });
        await this.reponseRepository.save(reponse);
      }
    }

    return this.apiResponse.success({
      success: true,
      message: "Question mise à jour",
    });
  }

  @Delete("quizzes/:quizId/questions/:questionId")
  async deleteQuestion(
    @Param("quizId") quizId: number,
    @Param("questionId") questionId: number
  ) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ["questions"],
    });
    const question = await this.questionRepository.findOne({
      where: { id: questionId, quiz_id: quizId },
    });

    if (!quiz || !question) {
      throw new HttpException(
        "Quiz ou question non trouvé",
        HttpStatus.NOT_FOUND
      );
    }

    await this.questionRepository.remove(question);

    const points = ((quiz.questions?.length || 0) - 1) * 2;
    quiz.nb_points_total = points.toString();
    await this.quizRepository.save(quiz);

    return this.apiResponse.success({
      success: true,
      message: "Question supprimée",
    });
  }

  @Post("quizzes/:id/publish")
  async publish(@Param("id") id: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ["questions"],
    });

    if (!quiz) {
      throw new HttpException("Quiz non trouvé", HttpStatus.NOT_FOUND);
    }

    if ((quiz.questions?.length || 0) === 0) {
      throw new HttpException(
        "Impossible de publier un quiz sans questions",
        HttpStatus.BAD_REQUEST
      );
    }

    quiz.status = "actif";
    await this.quizRepository.save(quiz);

    return this.apiResponse.success({
      success: true,
      message: "Quiz publié avec succès",
    });
  }

  @Get("formations-list")
  async getFormations() {
    const formations = await this.formationRepository.find({
      select: ["id", "titre"],
      order: { titre: "ASC" },
    });

    return this.apiResponse.success({ formations });
  }
}
