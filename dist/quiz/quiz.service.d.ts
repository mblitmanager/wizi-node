import { Repository } from "typeorm";
import { Quiz } from "../entities/quiz.entity";
import { Question } from "../entities/question.entity";
import { Formation } from "../entities/formation.entity";
import { Classement } from "../entities/classement.entity";
export declare class QuizService {
    private quizRepository;
    private questionRepository;
    private formationRepository;
    private classementRepository;
    constructor(quizRepository: Repository<Quiz>, questionRepository: Repository<Question>, formationRepository: Repository<Formation>, classementRepository: Repository<Classement>);
    getAllQuizzes(): Promise<Quiz[]>;
    getQuizDetails(id: number): Promise<Quiz>;
    getQuestionsByQuiz(quizId: number): Promise<Question[]>;
    getCategories(): Promise<any[]>;
    getHistoryByStagiaire(stagiaireId: number): Promise<Classement[]>;
}
