import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Classement } from "../entities/classement.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Formation } from "../entities/formation.entity";
export declare class StagiaireService {
    private stagiaireRepository;
    private classementRepository;
    private catalogueRepository;
    private formationRepository;
    constructor(stagiaireRepository: Repository<Stagiaire>, classementRepository: Repository<Classement>, catalogueRepository: Repository<CatalogueFormation>, formationRepository: Repository<Formation>);
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
        catalogue_formations: CatalogueFormation[];
        categories: any[];
    }>;
    getContacts(userId: number): Promise<{
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
    getContactsByType(userId: number, type: string): Promise<{
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
    getStagiaireQuizzes(userId: number): Promise<Classement[]>;
}
