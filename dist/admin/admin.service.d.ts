import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { User } from "../entities/user.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { Formateur } from "../entities/formateur.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Classement } from "../entities/classement.entity";
import { NotificationService } from "../notification/notification.service";
import { Formation } from "../entities/formation.entity";
import { Media } from "../entities/media.entity";
import { MediaStagiaire } from "../entities/media-stagiaire.entity";
import { StagiaireCatalogueFormation } from "../entities/stagiaire-catalogue-formation.entity";
import { Quiz } from "../entities/quiz.entity";
import { DemandeInscription } from "../entities/demande-inscription.entity";
import { Parrainage } from "../entities/parrainage.entity";
import { LoginHistory } from "../entities/login-history.entity";
import { MailService } from "../mail/mail.service";
export declare class AdminService {
    private stagiaireRepository;
    private userRepository;
    private quizParticipationRepository;
    private formateurRepository;
    private catalogueFormationRepository;
    private formationRepository;
    private mediaRepository;
    private mediaStagiaireRepository;
    private stagiaireCatalogueFormationRepository;
    private classementRepository;
    private quizRepository;
    private demandeInscriptionRepository;
    private parrainageRepository;
    private loginHistoryRepository;
    private notificationService;
    private mailService;
    constructor(stagiaireRepository: Repository<Stagiaire>, userRepository: Repository<User>, quizParticipationRepository: Repository<QuizParticipation>, formateurRepository: Repository<Formateur>, catalogueFormationRepository: Repository<CatalogueFormation>, formationRepository: Repository<Formation>, mediaRepository: Repository<Media>, mediaStagiaireRepository: Repository<MediaStagiaire>, stagiaireCatalogueFormationRepository: Repository<StagiaireCatalogueFormation>, classementRepository: Repository<Classement>, quizRepository: Repository<Quiz>, demandeInscriptionRepository: Repository<DemandeInscription>, parrainageRepository: Repository<Parrainage>, loginHistoryRepository: Repository<LoginHistory>, notificationService: NotificationService, mailService: MailService);
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
                title: any;
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
            prenom: string;
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
                prenom: string;
                email: string;
                image: string;
                last_quiz_at: string;
                total_quizzes: number;
                total_logins: number;
            }[];
            most_active: {
                id: number;
                name: string;
                prenom: string;
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
    getFormateurStagiaires(userId: number): Promise<{
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
    getStagiaireProfileById(id: number): Promise<{
        stagiaire: {
            id: number;
            prenom: string;
            nom: string;
            email: string;
            avatar: string;
            civilite: string;
            telephone: string;
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
        formations: {
            id: number;
            titre: string;
            progress: number;
            status: string;
        }[];
    }>;
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
        formation_id: number;
        formation_titre: any;
        student_count: number;
    }[]>;
    getFormateurAvailableFormations(): Promise<{
        id: number;
        titre: string;
        description: string;
        duree: string;
        image_url: string;
        tarif: number;
        categorie: string;
        formation_id: number;
    }[]>;
    getFormationStats(catalogueFormationId: number, userId: number): Promise<{
        student_count: number;
        avg_score: number;
        total_completions: number;
        id: number;
        titre: string;
    }>;
    getUnassignedStagiaires(catalogueFormationId: number, userId: number): Promise<{
        id: any;
        prenom: any;
        nom: any;
        email: any;
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
    getRankingByFormation(catalogueFormationId: number, period?: string): Promise<{
        rank: number;
        id: number;
        prenom: any;
        nom: any;
        email: any;
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
    getFormateurDashboardHome(userId: number, days?: number): Promise<{
        stats: {
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
                    title: any;
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
        } | {
            total_stagiaires: number;
            active_this_week: number;
            inactive_count: number;
            never_connected: number;
            avg_quiz_score: number;
            total_formations: number;
            total_quizzes_taken: number;
        };
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
        inactive_count: number;
        trends: {
            quiz_trends: {
                date: any;
                count: number;
                avg_score: number;
            }[];
            activity_trends: {
                date: any;
                count: number;
            }[];
        };
        stagiaires: {
            id: any;
            prenom: any;
            nom: any;
            email: any;
            avatar: any;
            is_active: boolean;
            never_connected: boolean;
            in_formation: boolean;
            progress: number;
            avg_score: number;
            modules_count: number;
            formation: any;
            last_activity_at: string;
        }[];
        stagiaires_count: number;
    }>;
    getFormateurFormationsWithVideos(userId: number): Promise<{
        formation_id: any;
        formation_titre: any;
        videos: any;
    }[]>;
    getFormateurStagiairesProgress(userId: number): Promise<{
        stagiaires: {
            id: any;
            prenom: any;
            nom: any;
            email: any;
            avatar: any;
            is_active: boolean;
            never_connected: boolean;
            in_formation: boolean;
            progress: number;
            avg_score: number;
            modules_count: number;
            formation: any;
            last_activity_at: string;
        }[];
        total: number;
    }>;
    getVideoStats(videoId: number): Promise<{
        video_id: number;
        total_views: number;
        total_duration_watched: number;
        completion_rate: number;
        views_by_stagiaire: {
            id: number;
            prenom: string;
            nom: string;
            completed: boolean;
            total_watched: number;
            percentage: number;
        }[];
    }>;
    getStagiaireFullFormations(id: number): Promise<{
        id: number;
        titre: string;
        completions: number;
        total_videos: number;
        avg_score: number;
        last_activity: Date;
        best_score: number;
    }[]>;
    getFormateurFormationStagiaires(userId: number, formationId: number): Promise<{
        formation: {
            id: number;
            titre: string;
            categorie: string;
        };
        stagiaires: {
            id: number;
            prenom: string;
            nom: string;
            email: string;
            date_debut: Date;
            date_fin: Date;
            progress: number;
            status: string;
        }[];
    }>;
    assignFormateurFormationStagiaires(userId: number, formationId: number, stagiaireIds: number[], dateDebut?: Date, dateFin?: Date): Promise<{
        success: boolean;
        message: string;
        assigned_count: number;
    }>;
    getDemandesSuivi(userId: number, role: string): Promise<{
        id: number;
        date: Date;
        statut: string;
        formation: string;
        stagiaire: {
            id: number;
            name: string;
            prenom: string;
        };
        motif: string;
    }[]>;
    getParrainageSuivi(userId: number, role: string): Promise<{
        id: number;
        date: Date;
        points: number;
        gains: number;
        parrain: {
            name: string;
        };
        filleul: {
            id: number;
            name: string;
            prenom: string;
            statut: string;
        };
    }[]>;
    sendFormateurEmail(senderId: number, recipientIds: number[], subject: string, message: string): Promise<{
        sent_count: number;
        details: any[];
    }>;
    getFormateurStudentsPerformance(userId: number): Promise<{
        id: any;
        prenom: any;
        nom: any;
        name: any;
        email: any;
        avatar: any;
        total_quizzes: number;
        average_score: number;
        best_score: number;
        total_logins: any;
        last_active: any;
    }[]>;
}
