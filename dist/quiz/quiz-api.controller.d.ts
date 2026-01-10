import { ApiResponseService } from "../common/services/api-response.service";
import { RankingService } from "../ranking/ranking.service";
export declare class QuizApiController {
    private rankingService;
    private apiResponse;
    constructor(rankingService: RankingService, apiResponse: ApiResponseService);
    byFormations(): Promise<any>;
    categories(): Promise<any>;
    byCategory(): Promise<any>;
    globalClassement(): Promise<any>;
    history(req: any): Promise<any>;
    stats(req: any): Promise<any>;
    statsCategories(): Promise<any>;
    statsPerformance(): Promise<any>;
    statsProgress(): Promise<any>;
    statsTrends(): Promise<any>;
    getById(id: number): Promise<any>;
    submitResult(id: number, data: any): Promise<any>;
    getQuestions(quizId: number): Promise<any>;
    submit(quizId: number, data: any): Promise<any>;
    getParticipation(quizId: number): Promise<any>;
    startParticipation(quizId: number): Promise<any>;
    saveProgress(quizId: number, data: any): Promise<any>;
    resumeParticipation(quizId: number): Promise<any>;
    complete(quizId: number): Promise<any>;
    getStatistics(quizId: number): Promise<any>;
    getUserParticipations(quizId: number): Promise<any>;
}
