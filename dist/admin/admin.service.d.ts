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
                id: number;
                titre: string;
            }[];
            current_page: number;
            first_page_url: string;
            from: number;
            last_page: number;
            last_page_url: string;
            links: any[];
            next_page_url: any;
            path: string;
            per_page: number;
            prev_page_url: any;
            to: number;
            total: number;
        };
        formateurs: {
            data: any[];
            current_page: number;
            first_page_url: string;
            from: any;
            last_page: number;
            last_page_url: string;
            links: any[];
            next_page_url: any;
            path: string;
            per_page: number;
            prev_page_url: any;
            to: any;
            total: number;
        };
    }>;
    getOnlineStagiaires(): Promise<Stagiaire[]>;
}
