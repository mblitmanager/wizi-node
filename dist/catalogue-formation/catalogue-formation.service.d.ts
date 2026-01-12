import { Repository } from "typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
export declare class CatalogueFormationService {
    private readonly catalogueRepository;
    private readonly stagiaireRepository;
    constructor(catalogueRepository: Repository<CatalogueFormation>, stagiaireRepository: Repository<Stagiaire>);
    findAll(): Promise<any[]>;
    findOne(id: number, baseUrl?: string): Promise<any>;
    private formatCatalogueJson;
    getCataloguesWithFormations(query: {
        per_page?: number;
        category?: string;
        search?: string;
        page?: number;
    }): Promise<{
        data: {
            id: number;
            titre: string;
            description: string;
            prerequis: string;
            image_url: string;
            cursus_pdf: string;
            tarif: number;
            certification: string;
            statut: number;
            duree: string;
            created_at: Date;
            updated_at: Date;
            cursusPdfUrl: string;
            formation: {
                id: number;
                titre: string;
                description: string;
                categorie: string;
                duree: string;
                image_url: string;
                statut: number;
            };
            stagiaires_count: any;
        }[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    }>;
    getFormationsAndCatalogues(stagiaireId: number): Promise<any>;
}
