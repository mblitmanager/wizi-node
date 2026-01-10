import { ApiResponseService } from "../common/services/api-response.service";
export declare class QuizApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    byFormations(): Promise<any>;
    categories(): Promise<any>;
    byCategory(): Promise<any>;
    globalClassement(): Promise<any>;
    history(): Promise<any>;
    stats(): Promise<any>;
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
