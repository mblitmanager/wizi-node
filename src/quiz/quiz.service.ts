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
}
