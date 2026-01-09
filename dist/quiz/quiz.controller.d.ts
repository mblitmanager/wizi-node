import { QuizService } from "./quiz.service";
export declare class QuizController {
    private quizService;
    constructor(quizService: QuizService);
    getCategories(): Promise<any[]>;
    getStats(req: any): Promise<{
        total_quizzes: number;
        total_points: number;
        average_score: number;
    }>;
    getStatsCategories(req: any): Promise<any[]>;
    getStatsProgress(req: any): Promise<import("../entities/classement.entity").Classement[]>;
    getStatsTrends(req: any): Promise<any[]>;
    getStatsPerformance(req: any): Promise<any[]>;
    getHistory(req: any): Promise<import("../entities/classement.entity").Classement[]>;
    getAllQuizzes(): Promise<import("../entities/quiz.entity").Quiz[]>;
    getQuizDetails(id: string): Promise<import("../entities/quiz.entity").Quiz>;
    getQuestions(id: string): Promise<import("../entities/question.entity").Question[]>;
}
