import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Classement } from "../entities/classement.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Formation } from "../entities/formation.entity";
import { Quiz } from "../entities/quiz.entity";
import { QuizParticipation } from "../entities/quiz-participation.entity";
import { RankingService } from "../ranking/ranking.service";
import { User } from "../entities/user.entity";
import { AgendaService } from "../agenda/agenda.service";
import { MediaService } from "../media/media.service";
export declare class StagiaireService {
    private stagiaireRepository;
    private classementRepository;
    private catalogueRepository;
    private formationRepository;
    private quizRepository;
    private participationRepository;
    private userRepository;
    private rankingService;
    private agendaService;
    private mediaService;
    constructor(stagiaireRepository: Repository<Stagiaire>, classementRepository: Repository<Classement>, catalogueRepository: Repository<CatalogueFormation>, formationRepository: Repository<Formation>, quizRepository: Repository<Quiz>, participationRepository: Repository<QuizParticipation>, userRepository: Repository<User>, rankingService: RankingService, agendaService: AgendaService, mediaService: MediaService);
    getProfile(userId: number): Promise<Stagiaire>;
    getHomeData(userId: number): Promise<{
        user: {
            id: number;
            prenom: string;
            image: string;
        };
        quiz_stats: {
            total_quizzes: number;
            total_points: number;
            average_score: number;
        };
        recent_history: Classement[];
        contacts: {
            formateurs: {
                id: any;
                prenom: any;
                nom: any;
                email: any;
                telephone: any;
                role: any;
                civilite: any;
                image: any;
                type: string;
            }[];
            commerciaux: {
                id: any;
                prenom: any;
                nom: any;
                email: any;
                telephone: any;
                role: any;
                civilite: any;
                image: any;
                type: string;
            }[];
            pole_relation: {
                id: any;
                prenom: any;
                nom: any;
                email: any;
                telephone: any;
                role: any;
                civilite: any;
                image: any;
                type: string;
            }[];
        };
        catalogue_formations: CatalogueFormation[];
        categories: any[];
    }>;
    getContacts(userId: number): Promise<{
        formateurs: {
            id: any;
            prenom: any;
            nom: any;
            email: any;
            telephone: any;
            role: any;
            civilite: any;
            image: any;
            type: string;
        }[];
        commerciaux: {
            id: any;
            prenom: any;
            nom: any;
            email: any;
            telephone: any;
            role: any;
            civilite: any;
            image: any;
            type: string;
        }[];
        pole_relation: {
            id: any;
            prenom: any;
            nom: any;
            email: any;
            telephone: any;
            role: any;
            civilite: any;
            image: any;
            type: string;
        }[];
    }>;
    getContactsByType(userId: number, type: string): Promise<{
        id: any;
        prenom: any;
        nom: any;
        email: any;
        telephone: any;
        role: any;
        civilite: any;
        image: any;
        type: string;
    }[]>;
    getStagiaireQuizzes(userId: number): Promise<{
        data: {
            id: string;
            titre: string;
            description: string;
            duree: string;
            niveau: string;
            status: string;
            nb_points_total: number;
            formationId: string;
            categorie: string;
            formation: {
                id: number;
                titre: string;
                categorie: string;
            };
            questions: any[];
            userParticipation: {
                id: number;
                status: string;
                score: number;
                correct_answers: number;
                time_spent: number;
                started_at: string;
                completed_at: string;
            };
        }[];
    }>;
    getFormationsByStagiaire(stagiaireId: number): Promise<{
        success: boolean;
        data: any[];
    }>;
    getStagiaireById(id: number): Promise<{
        id: number;
        firstname: string;
        lastname: string;
        name: string;
        avatar: string;
        rang: number;
        totalPoints: number;
        formations: {
            id: number;
            titre: string;
        }[];
        formateurs: {
            id: any;
            prenom: any;
            nom: any;
            image: any;
        }[];
        quizStats: {
            totalCompleted: number;
            totalQuiz: number;
            pourcentageReussite: number;
            byLevel: {
                debutant: {
                    completed: number;
                    total: number;
                };
                intermediaire: {
                    completed: number;
                    total: number;
                };
                expert: {
                    completed: number;
                    total: number;
                };
            };
            lastActivity: Date;
        };
    }>;
    getMyPartner(userId: number): Promise<{
        identifiant: string;
        type: string;
        adresse: string;
        ville: string;
        departement: string;
        code_postal: string;
        logo: string;
        actif: boolean;
        contacts: any;
    }>;
    getDetailedProfile(userId: number): Promise<{
        id: number;
        prenom: string;
        nom: string;
        telephone: string;
        ville: string;
        code_postal: string;
        adresse: string;
        email: string;
        image: string;
    }>;
    updatePassword(userId: number, data: any): Promise<boolean>;
    updateProfilePhoto(userId: number, photoPath: string): Promise<boolean>;
    setOnboardingSeen(userId: number): Promise<boolean>;
    getOnlineUsers(): Promise<{
        online_users: User[];
        recently_online: User[];
        all_users: User[];
    }>;
    getShowData(userId: number): Promise<{
        stagiaire: {
            id: number;
            prenom: string;
            nom: string;
            telephone: string;
            ville: string;
            code_postal: string;
            adresse: string;
            email: string;
            image: string;
        };
        stats: {
            stagiaire: any;
            totalPoints: number;
            quizCount: number;
            averageScore: number;
            completedQuizzes: number;
            totalTimeSpent: number;
            rang: number;
            level: number;
            categoryStats: any[];
            levelProgress: {};
        } | {
            stagiaire: {
                id: string;
                prenom: string;
                image: string;
            };
            totalPoints: any;
            quizCount: number;
            averageScore: number;
            completedQuizzes: number;
            totalTimeSpent: number;
            rang: number;
            level: number;
            categoryStats: {
                category: string;
                quizCount: number;
                averageScore: number;
            }[];
            levelProgress: {
                débutant: {
                    completed: number;
                    averageScore: number;
                };
                intermédiaire: {
                    completed: number;
                    averageScore: number;
                };
                avancé: {
                    completed: number;
                    averageScore: number;
                };
            };
        };
        formations: any;
        agenda: {
            formations: Formation[];
            events: import("../entities/agenda.entity").Agenda[];
            upcoming_events: import("../entities/agenda.entity").Agenda[];
        };
        notifications: import("../entities/notification.entity").Notification[];
        media: {
            stagiaires: {
                id: number;
                prenom: string;
                civilite: string;
                telephone: string;
                adresse: string;
                date_naissance: string;
                ville: string;
                code_postal: string;
                date_debut_formation: string;
                date_inscription: string;
                role: string;
                statut: string;
                user_id: number;
                deleted_at: any;
                created_at: string;
                updated_at: string;
                date_fin_formation: string;
                login_streak: number;
                last_login_at: string;
                onboarding_seen: number;
                partenaire_id: number;
                pivot: {
                    media_id: number;
                    stagiaire_id: number;
                    is_watched: number;
                    watched_at: string;
                    created_at: any;
                    updated_at: string;
                };
            }[];
            id: number;
            titre: string;
            description: string;
            url: string;
            size: number;
            mime: string;
            uploaded_by: number;
            video_platform: string;
            video_file_path: string;
            subtitle_file_path: string;
            subtitle_language: string;
            type: string;
            categorie: string;
            duree: string;
            ordre: number;
            formation_id: number;
            created_at: string;
            updated_at: string;
            video_url: string;
            subtitle_url: string;
        }[];
    }>;
}
