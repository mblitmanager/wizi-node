import { QuizService } from "./quiz.service";
export declare class QuizController {
    private quizService;
    constructor(quizService: QuizService);
    getAllQuizzes(): Promise<import("../entities/quiz.entity").Quiz[]>;
    getQuizDetails(id: string): Promise<import("../entities/quiz.entity").Quiz>;
    getQuestions(id: string): Promise<import("../entities/question.entity").Question[]>;
}
