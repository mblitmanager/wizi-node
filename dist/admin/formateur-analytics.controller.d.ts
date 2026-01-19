import { ApiResponseService } from "../common/services/api-response.service";
import { Repository } from "typeorm";
import { Formateur } from "../entities/formateur.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
export declare class FormateurAnalyticsController {
    private formateurRepository;
    private quizParticipationRepository;
    private apiResponse;
    constructor(formateurRepository: Repository<Formateur>, quizParticipationRepository: Repository<QuizParticipation>, apiResponse: ApiResponseService);
    getQuizSuccessRate(period: number, req: any): Promise<any>;
    getCompletionTime(period: number, req: any): Promise<any>;
    getActivityHeatmap(period: number, req: any): Promise<any>;
    getDropoutRate(req: any): Promise<any>;
    getDashboard(period: number, req: any): Promise<any>;
}
