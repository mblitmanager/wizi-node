import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { Question } from "../entities/question.entity";
export declare class QuizService {
    private quizRepository;
    private questionRepository;
    constructor(quizRepository: Repository<Quiz>, questionRepository: Repository<Question>);
    getAllQuizzes(): Promise<Quiz[]>;
    getQuizDetails(id: number): Promise<Quiz>;
    getQuestionsByQuiz(quizId: number): Promise<Question[]>;
}
