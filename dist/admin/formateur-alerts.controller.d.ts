import { ApiResponseService } from "../common/services/api-response.service";
import { Repository } from "typeorm";
import { Formateur } from "../entities/formateur.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
export declare class FormateurAlertsController {
    private formateurRepository;
    private stagiaireRepository;
    private quizParticipationRepository;
    private apiResponse;
    constructor(formateurRepository: Repository<Formateur>, stagiaireRepository: Repository<Stagiaire>, quizParticipationRepository: Repository<QuizParticipation>, apiResponse: ApiResponseService);
    getAlerts(req: any): Promise<any>;
    getAlertStats(req: any): Promise<any>;
}
