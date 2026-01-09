import { StagiaireService } from "./stagiaire.service";
export declare class StagiaireController {
    private stagiaireService;
    constructor(stagiaireService: StagiaireService);
    getProfile(req: any): Promise<import("../entities/stagiaire.entity").Stagiaire>;
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
                name: any;
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
                name: any;
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
                name: any;
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
            name: any;
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
            name: any;
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
            name: any;
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
        name: any;
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
        name: any;
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
        name: any;
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
        name: any;
        email: any;
        telephone: any;
        role: any;
        civilite: any;
        image: any;
        type: string;
    }[]>;
    getMyQuizzes(req: any): Promise<import("../entities/classement.entity").Classement[]>;
    getStagiaireFormations(id: number): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
}
