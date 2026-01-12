import { ApiResponseService } from "../common/services/api-response.service";
import { QuizService } from "./quiz.service";
export declare class QuizzesApiController {
    private quizService;
    private apiResponse;
    constructor(quizService: QuizService, apiResponse: ApiResponseService);
    getById(id: number): Promise<{
        "@context": string;
        "@id": string;
        "@type": string;
        id: number;
        titre: string;
        description: string;
        duree: string;
        formation: string;
        nbPointsTotal: string;
        niveau: string;
        questions: string[];
        participations: any[];
        status: string;
        createdAt: string;
        updatedAt: string;
    }>;
    submit(quizId: number, data: any): Promise<any>;
}
