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
    getStatsDashboard(period?: string): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        stats: {
            total_stagiaires: number;
            total_quizzes: number;
            total_formations: number;
            total_achievements: number;
            new_stagiaires: number;
            new_quizzes: number;
        };
        charts: {
            stagiaires_trend: any[];
            quizzes_trend: any[];
            top_formations: any[];
        };
        recent_activity: {
            recent_stagiaires: Stagiaire[];
            recent_quizzes: Quiz[];
        };
    }>>;
    getDashboardStats(req: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<{
        stats: {
            total_stagiaires: number;
            total_quizzes: number;
            total_formations: number;
            total_achievements: number;
            recent_stagiaires: number;
            recent_quizzes: number;
        };
        charts: {
            stagiaires_trend: any[];
            quizzes_trend: any[];
            top_formations: any[];
        };
        recent_activity: {
            recent_stagiaires: Stagiaire[];
            recent_quizzes: Quiz[];
        };
    }>>;
    private getStagiairesTrend;
    private getStagiairesTrendByPeriod;
    private getQuizzesTrend;
    private getQuizzesTrendByPeriod;
    private getTopFormations;
    private getRecentActivity;
}
