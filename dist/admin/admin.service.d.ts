import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { User } from "../entities/user.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { Formateur } from "../entities/formateur.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
export declare class AdminService {
    private stagiaireRepository;
    private userRepository;
    private quizParticipationRepository;
    private formateurRepository;
    private formationRepository;
    constructor(stagiaireRepository: Repository<Stagiaire>, userRepository: Repository<User>, quizParticipationRepository: Repository<QuizParticipation>, formateurRepository: Repository<Formateur>, formationRepository: Repository<CatalogueFormation>);
    getFormateurDashboardStats(userId: number): Promise<{
        total_stagiaires: number;
        active_this_week: number;
        inactive_count: number;
        never_connected: number;
        avg_quiz_score: number;
        total_formations: number;
        total_quizzes_taken: number;
        total_video_hours: number;
        formations: {
            data: {
                id: any;
                nom: any;
                total_stagiaires: number;
                stagiaires_actifs: number;
                score_moyen: string;
            }[];
            current_page: number;
            first_page_url: string;
            from: number;
            last_page: number;
            last_page_url: string;
            links: any[];
            next_page_url: string;
            path: string;
            per_page: number;
            prev_page_url: any;
            to: number;
            total: number;
        };
        formateurs: {
            data: {
                id: any;
                prenom: any;
                nom: any;
                total_stagiaires: number;
            }[];
            current_page: number;
            first_page_url: string;
            from: number;
            last_page: number;
            last_page_url: string;
            links: any[];
            next_page_url: string;
            path: string;
            per_page: number;
            prev_page_url: any;
            to: number;
            total: number;
        };
    }>;
    getFormateurStagiairesPerformance(userId: number): Promise<{
        performance: {
            id: number;
            name: string;
            email: string;
            image: string;
            last_quiz_at: string;
            total_quizzes: number;
            total_logins: number;
        }[];
        rankings: {
            most_quizzes: {
                id: number;
                name: string;
                email: string;
                image: string;
                last_quiz_at: string;
                total_quizzes: number;
                total_logins: number;
            }[];
            most_active: {
                id: number;
                name: string;
                email: string;
                image: string;
                last_quiz_at: string;
                total_quizzes: number;
                total_logins: number;
            }[];
        };
    }>;
    getFormateurInactiveStagiaires(userId: number): Promise<{
        inactive_stagiaires: {
            id: number;
            prenom: string;
            nom: string;
            email: string;
            last_activity_at: string;
            days_since_activity: number;
            never_connected: boolean;
            last_client: string;
        }[];
        count: number;
        threshold_days: number;
    }>;
    getOnlineStagiaires(): Promise<Stagiaire[]>;
}
