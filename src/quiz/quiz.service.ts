import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { Question } from "../entities/question.entity";
import { Formation } from "../entities/formation.entity";
import { Classement } from "../entities/classement.entity";

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>,
    @InjectRepository(Classement)
    private classementRepository: Repository<Classement>
  ) {}

  async getAllQuizzes() {
    return this.quizRepository.find({ relations: ["formation"] });
  }

  async getQuizDetails(id: number) {
    return this.quizRepository.findOne({
      where: { id },
      relations: ["formation"],
    });
  }

  async getQuestionsByQuiz(quizId: number) {
    return this.questionRepository.find({
      where: { quiz_id: quizId },
      relations: ["reponses"],
    });
  }

  async getCategories() {
    const categoriesRaw = await this.formationRepository
      .createQueryBuilder("formation")
      .select("DISTINCT formation.categorie", "categorie")
      .where("formation.statut = :statut", { statut: "1" })
      .getRawMany();
    return categoriesRaw.map((c) => c.categorie);
  }

  async getHistoryByStagiaire(stagiaireId: number) {
    return this.classementRepository.find({
      where: { stagiaire_id: stagiaireId },
      relations: ["quiz"],
      order: { updated_at: "DESC" },
    });
  }

  async getStats(userId: number) {
    // Get basic stats for the user
    const stats = await this.classementRepository
      .createQueryBuilder("classement")
      .select("COUNT(*)", "total_quizzes")
      .addSelect("SUM(classement.points)", "total_points")
      .addSelect("AVG(classement.points)", "average_score")
      .where("classement.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)", { userId })
      .getRawOne();

    return {
      total_quizzes: parseInt(stats?.total_quizzes || "0") || 0,
      total_points: parseInt(stats?.total_points || "0") || 0,
      average_score: parseFloat(stats?.average_score || "0") || 0,
    };
  }

  async getStatsCategories(userId: number) {
    return this.classementRepository
      .createQueryBuilder("classement")
      .leftJoinAndSelect("classement.quiz", "quiz")
      .leftJoinAndSelect("quiz.formation", "formation")
      .select("formation.categorie", "category")
      .addSelect("COUNT(classement.id)", "count")
      .addSelect("AVG(classement.points)", "average_points")
      .where("classement.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)", { userId })
      .groupBy("formation.categorie")
      .getRawMany();
  }

  async getStatsProgress(userId: number) {
    return this.classementRepository.find({
      where: { 
        stagiaire_id: userId,
      },
      relations: ["quiz"],
      order: { created_at: "DESC" },
      take: 10,
    });
  }

  async getStatsTrends(userId: number) {
    return this.classementRepository
      .createQueryBuilder("classement")
      .select("DATE(classement.created_at)", "date")
      .addSelect("COUNT(classement.id)", "count")
      .addSelect("AVG(classement.points)", "average_points")
      .where("classement.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)", { userId })
      .groupBy("DATE(classement.created_at)")
      .orderBy("DATE(classement.created_at)", "DESC")
      .limit(30)
      .getRawMany();
  }

  async getStatsPerformance(userId: number) {
    return this.classementRepository
      .createQueryBuilder("classement")
      .leftJoinAndSelect("classement.quiz", "quiz")
      .select("quiz.titre", "quiz_title")
      .addSelect("classement.points", "score")
      .addSelect("classement.created_at", "date")
      .where("classement.stagiaire_id IN (SELECT id FROM stagiaires WHERE user_id = :userId)", { userId })
      .orderBy("classement.created_at", "DESC")
      .take(20)
      .getRawMany();
  }
}
