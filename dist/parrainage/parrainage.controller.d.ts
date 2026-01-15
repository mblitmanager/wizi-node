import { ParrainageService } from "./parrainage.service";
import { FormationService } from "../formation/formation.service";
export declare class ParrainageController {
    private parrainageService;
    private formationService;
    constructor(parrainageService: ParrainageService, formationService: FormationService);
    getFormationParrainage(): Promise<{
        id: number;
        titre: string;
        description: string;
        prerequis: string;
        image_url: string;
        cursus_pdf: string;
        tarif: string;
        certification: string;
        statut: number;
        duree: string;
        formation_id: number;
        deleted_at: any;
        created_at: string;
        updated_at: string;
        objectifs: string;
        programme: string;
        modalites: string;
        modalites_accompagnement: string;
        moyens_pedagogiques: string;
        modalites_suivi: string;
        evaluation: string;
        lieu: string;
        niveau: string;
        public_cible: string;
        nombre_participants: number;
        formation: {
            id: number;
            titre: string;
            slug: string;
            description: string;
            statut: number;
            duree: string;
            categorie: string;
            image: string;
            icon: string;
            created_at: string;
            updated_at: string;
        };
        formateurs: {
            id: any;
            role: any;
            prenom: any;
            civilite: any;
            user_id: any;
            telephone: any;
            deleted_at: any;
            created_at: string;
            updated_at: string;
            pivot: {
                catalogue_formation_id: number;
                formateur_id: any;
            };
        }[];
        stagiaires: {
            id: number;
            prenom: string;
            civilite: string;
            telephone: string;
            adresse: string;
            date_naissance: Date;
            ville: string;
            code_postal: string;
            date_debut_formation: Date;
            date_inscription: Date;
            role: string;
            statut: string;
            user_id: number;
            deleted_at: any;
            created_at: string;
            updated_at: string;
            date_fin_formation: Date;
            login_streak: number;
            last_login_at: string;
            onboarding_seen: number;
            partenaire_id: number;
            pivot: {
                catalogue_formation_id: number;
                stagiaire_id: number;
                date_debut: Date;
                date_inscription: Date;
                date_fin: Date;
                formateur_id: number;
                created_at: string;
                updated_at: string;
            };
        }[];
    }[]>;
    getEvents(): Promise<{
        success: boolean;
        data: {
            id: number;
            titre: string;
            prix: string;
            date_debut: string;
            date_fin: string;
            created_at: string;
            updated_at: string;
            status: string;
        }[];
    }>;
    getParrainData(token: string): Promise<{
        success: boolean;
        parrain: any;
    }>;
    registerFilleul(data: any): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: number;
                name: string;
                email: string;
            };
            stagiaire: {
                id: number;
            };
        };
    }>;
    generateLink(req: any): Promise<{
        success: boolean;
        token: string;
    }>;
    getStatsParrain(req: any): Promise<{
        success: boolean;
        parrain_id: number;
        nombre_filleuls: number;
        total_points: number;
        gains: number;
    }>;
    getStatsParrainById(parrainId: number): Promise<{
        success: boolean;
        parrain_id: number;
        nombre_filleuls: number;
        total_points: number;
        gains: number;
    }>;
    getFilleuls(req: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            date: Date;
            points: number;
            status: string;
        }[];
    }>;
    getRewards(req: any): Promise<{
        success: boolean;
        total_points: number;
        total_filleuls: number;
        gains: number;
        rewards: {
            id: number;
            points: number;
            date: Date;
        }[];
    }>;
    getHistory(req: any): Promise<{
        success: boolean;
        parrainages: {
            id: number;
            parrain_id: number;
            filleul_id: number;
            points: number;
            gains: number;
            created_at: Date;
            filleul: {
                id: number;
                name: string;
                statut: string;
            };
        }[];
        tokens: {
            id: number;
            token: string;
            created_at: Date;
            expires_at: Date;
        }[];
    }>;
}
