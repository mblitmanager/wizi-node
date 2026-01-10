import { Repository } from "typeorm";
import { Formation } from "../entities/formation.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
export declare class FormationService {
    private formationRepository;
    private catalogueRepository;
    constructor(formationRepository: Repository<Formation>, catalogueRepository: Repository<CatalogueFormation>);
    getAllFormations(): Promise<Formation[]>;
    getAllCatalogueFormations(): Promise<CatalogueFormation[]>;
    getCataloguesWithFormations(query: {
        per_page?: number;
        category?: string;
        search?: string;
    }): Promise<{
        data: {
            formation: any;
            id: number;
            titre: string;
            description: string;
            statut: number;
            certification: string;
            prerequis: string;
            duree: string;
            image_url: string;
            tarif: number;
            formation_id: number;
            cursus_pdf: string;
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
            created_at: Date;
            updated_at: Date;
            stagiaires: any[];
            formateurs: any[];
        }[];
        total: number;
        per_page: number;
    }>;
    getFormationsAndCatalogues(stagiaireId: number): Promise<CatalogueFormation[]>;
}
