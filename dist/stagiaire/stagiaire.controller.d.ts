import { StagiaireService } from "./stagiaire.service";
import { InscriptionService } from "../inscription/inscription.service";
import { RankingService } from "../ranking/ranking.service";
export declare class StagiaireController {
    private stagiaireService;
    private inscriptionService;
    private rankingService;
    constructor(stagiaireService: StagiaireService, inscriptionService: InscriptionService, rankingService: RankingService);
    getProgress(req: any): Promise<{
        rang: number;
        level: string;
        stagiaire: {
            id: any;
            prenom: any;
            nom: any;
            image: any;
        };
        formateurs: any;
        totalPoints: any;
        quizCount: any;
        averageScore: number;
    } | {
        stagiaire: {
            id: string;
            prenom: string;
            image: any;
        };
        totalPoints: number;
        quizCount: number;
        averageScore: number;
        rang: number;
        level: string;
    }>;
    getProfile(req: any): Promise<{
        stagiaire: {
            id: number;
            civilite: string;
            prenom: string;
            telephone: string;
            adresse: string;
            ville: string;
            code_postal: string;
            date_naissance: Date;
            date_debut_formation: Date;
            date_inscription: Date;
            role: string;
            statut: string;
            user_id: number;
            onboarding_seen: boolean;
            user: {
                id: number;
                name: string;
                email: string;
                image: string;
            };
        };
        stats: {
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
        formations: {
            success: boolean;
            data: any[];
        };
        agenda: {
            formations: any[];
            events: import("../entities/agenda.entity").Agenda[];
            upcoming_events: import("../entities/agenda.entity").Agenda[];
        };
        notifications: import("../entities/notification.entity").Notification[];
        media: {
            tutorials: {
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
                stagiaires: {
                    id: number;
                    is_watched: number;
                    watched_at: Date;
                    pivot: {
                        media_id: number;
                        stagiaire_id: number;
                        is_watched: number;
                        watched_at: Date;
                        created_at: Date;
                        updated_at: Date;
                    };
                }[];
            }[];
        };
    }>;
    testAuth(): Promise<{
        message: string;
    }>;
    getHomeData(req: any): Promise<{
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
        recent_history: import("../entities/classement.entity").Classement[];
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
        catalogue_formations: import("../entities/catalogue-formation.entity").CatalogueFormation[];
        categories: any[];
    }>;
    getContacts(req: any): Promise<{
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
    getCommerciaux(req: any): Promise<{
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
    getFormateurs(req: any): Promise<{
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
    getPoleRelation(req: any): Promise<{
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
    getPoleSave(req: any): Promise<{
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
    getMyQuizzes(req: any): Promise<{
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
    getStagiaireFormations(id: number): Promise<{
        success: boolean;
        data: any[];
    }>;
    inscrireAFormation(req: any, catalogueFormationId: number): Promise<{
        success: boolean;
        message: string;
        demande: import("../entities/demande-inscription.entity").DemandeInscription;
    }>;
    getMyPartner(req: any): Promise<{
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
    updatePassword(req: any, data: any): Promise<{
        success: boolean;
    }>;
    setOnboardingSeen(req: any): Promise<{
        success: boolean;
    }>;
    getOnlineUsers(): Promise<{
        online_users: import("../entities/user.entity").User[];
        recently_online: import("../entities/user.entity").User[];
        all_users: import("../entities/user.entity").User[];
    }>;
    uploadProfilePhoto(req: any, file: any): Promise<{
        success: boolean;
        image: string;
        image_url: string;
    }>;
}
