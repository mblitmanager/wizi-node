import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Quiz } from "../entities/quiz.entity";
import { Formation } from "../entities/formation.entity";
import { Achievement } from "../entities/achievement.entity";
export declare class AdminDashboardController {
    private stagiaireRepository;
    private quizRepository;
    private formationRepository;
    private achievementRepository;
    constructor(stagiaireRepository: Repository<Stagiaire>, quizRepository: Repository<Quiz>, formationRepository: Repository<Formation>, achievementRepository: Repository<Achievement>);
    getDashboardStats(req: any): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    private getStagiairesTrend;
    private getQuizzesTrend;
    private getTopFormations;
    private getRecentActivity;
}
