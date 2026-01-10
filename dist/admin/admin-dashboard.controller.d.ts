import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Quiz } from "../entities/quiz.entity";
import { Formation } from "../entities/formation.entity";
import { Achievement } from "../entities/achievement.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminDashboardController {
    private stagiaireRepository;
    private quizRepository;
    private formationRepository;
    private achievementRepository;
    private apiResponse;
    constructor(stagiaireRepository: Repository<Stagiaire>, quizRepository: Repository<Quiz>, formationRepository: Repository<Formation>, achievementRepository: Repository<Achievement>, apiResponse: ApiResponseService);
    getStatsDashboard(period?: string): Promise<any>;
    getDashboardStats(req: any): Promise<any>;
    private getStagiairesTrend;
    private getStagiairesTrendByPeriod;
    private getQuizzesTrend;
    private getQuizzesTrendByPeriod;
    private getTopFormations;
    private getRecentActivity;
}
