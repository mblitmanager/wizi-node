import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { User } from "../entities/user.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { Formateur } from "../entities/formateur.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { NotificationService } from "../notification/notification.service";
export declare class AdminService {
    private stagiaireRepository;
    private userRepository;
    private quizParticipationRepository;
    private formateurRepository;
    private formationRepository;
    private notificationService;
    constructor(stagiaireRepository: Repository<Stagiaire>, userRepository: Repository<User>, quizParticipationRepository: Repository<QuizParticipation>, formateurRepository: Repository<Formateur>, formationRepository: Repository<CatalogueFormation>, notificationService: NotificationService);
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
    getFormateurInactiveStagiaires(userId: number, days?: number, scope?: string): Promise<{
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
    getFormateurStagiaires(): Promise<{
        id: number;
        prenom: string;
        nom: string;
        email: string;
        telephone: string;
        ville: string;
        last_login_at: string;
        last_activity_at: string;
        is_online: number;
        last_client: string;
        image: string;
    }[]>;
    getOnlineStagiaires(): Promise<{
        id: number;
        prenom: string;
        nom: string;
        email: string;
        avatar: string;
        last_activity_at: string;
        formations: string[];
    }[]>;
    getFormateurOnlineStagiaires(userId: number): Promise<{
        id: number;
        prenom: string;
        nom: string;
        email: string;
        avatar: string;
        last_activity_at: string;
        formations: string[];
    }[]>;
    getNeverConnected(): Promise<{
        id: number;
        prenom: string;
        nom: string;
        email: string;
        last_activity_at: any;
    }[]>;
    getStagiaireStats(id: number): Promise<{
        stagiaire: {
            id: number;
            prenom: string;
            nom: string;
            email: string;
        };
        quiz_stats: {
            total_quiz: number;
            avg_score: number;
            best_score: number;
            total_correct: number;
            total_questions: number;
        };
        activity: {
            last_activity: string;
            last_login: string;
            is_online: boolean;
            last_client: string;
        };
    }>;
    getFormateurMesStagiairesRanking(userId: number, period?: string): Promise<{
        ranking: any[];
        total_stagiaires: number;
        period: string;
    } | {
        ranking: {
            rank: number;
            id: number;
            prenom: any;
            nom: any;
            email: any;
            image: any;
            total_points: number;
            total_quiz: number;
            avg_score: number;
        }[];
        total_stagiaires: number;
        period?: undefined;
    }>;
    getTrainerArenaRanking(period?: string, formationId?: number): Promise<any[]>;
    getFormateurFormations(userId: number): Promise<{
        avg_score: number;
        total_completions: number;
        id: number;
        titre: any;
        image_url: any;
        tarif: any;
        student_count: number;
    }[]>;
    getStagiaireFormationPerformance(id: number): Promise<{
        id: number;
        titre: string;
        image_url: string;
        avg_score: number;
        best_score: number;
        completions: number;
        last_activity: string;
    }[]>;
    getFormateurTrends(userId: number): Promise<{
        quiz_trends: {
            date: any;
            count: number;
            avg_score: number;
        }[];
        activity_trends: {
            date: any;
            count: number;
        }[];
    }>;
    getCommercialDashboardStats(): Promise<{
        summary: {
            totalSignups: number;
            signupsThisMonth: number;
            activeStudents: number;
            conversionRate: number;
        };
        recentSignups: {
            id: number;
            name: string;
            email: string;
            role: string;
            created_at: string;
        }[];
        topFormations: {
            id: number;
            name: any;
            enrollments: number;
            price: number;
        }[];
        signupTrends: {
            date: any;
            value: number;
        }[];
    }>;
    disconnectStagiaires(stagiaireIds: number[]): Promise<number>;
    sendNotification(senderId: number, recipientIds: number[], title: string, message: string): Promise<{
        success: boolean;
        count: number;
    }>;
    getMyStagiairesRanking(userId: number, period?: string): Promise<{
        rank: number;
        id: number;
        prenom: any;
        nom: any;
        email: any;
        image: any;
        total_points: number;
        total_quiz: number;
        avg_score: number;
    }[]>;
    getFormateurAnalyticsDashboard(userId: number, period?: number, formationId?: number): Promise<{
        period_days: number;
        summary: {
            total_stagiaires: number;
            active_stagiaires: number;
            total_completions: number;
            average_score: number;
            trend_percentage: number;
        };
    }>;
    getFormateurQuizSuccessRate(userId: number, period?: number, formationId?: number): Promise<{
        period_days: number;
        quiz_stats: {
            quiz_id: any;
            quiz_name: any;
            category: any;
            total_attempts: any;
            successful_attempts: any;
            success_rate: number;
            average_score: number;
        }[];
    }>;
    getFormateurActivityHeatmap(userId: number, period?: number, formationId?: number): Promise<{
        period_days: number;
        activity_by_day: {
            day: string;
            activity_count: number;
        }[];
        activity_by_hour: {
            hour: number;
            activity_count: number;
        }[];
    }>;
    getFormateurDropoutRate(userId: number, formationId?: number): Promise<{
        overall: {
            total_attempts?: undefined;
            completed?: undefined;
            abandoned?: undefined;
            dropout_rate?: undefined;
        };
        quiz_dropout: any[];
    } | {
        overall: {
            total_attempts: number;
            completed: number;
            abandoned: number;
            dropout_rate: number;
        };
        quiz_dropout: {
            quiz_name: any;
            category: any;
            total_attempts: number;
            completed: number;
            abandoned: number;
            dropout_rate: number;
        }[];
    }>;
    getFormateurFormationsPerformance(userId: number): Promise<any[]>;
    getFormateurStudentsComparison(userId: number, formationId?: number): Promise<any[]>;
}
