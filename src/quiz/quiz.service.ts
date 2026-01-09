import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { Question } from "../entities/question.entity";

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>
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
}
