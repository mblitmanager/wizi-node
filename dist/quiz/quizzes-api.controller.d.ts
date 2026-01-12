import { ApiResponseService } from "../common/services/api-response.service";
import { QuizService } from "./quiz.service";
export declare class QuizzesApiController {
    private quizService;
    private apiResponse;
    constructor(quizService: QuizService, apiResponse: ApiResponseService);
    getById(id: number): Promise<any>;
    submit(quizId: number, data: any): Promise<any>;
}
