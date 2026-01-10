import { Repository } from "typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
export declare class CatalogueFormationService {
    private readonly catalogueRepository;
    private readonly stagiaireRepository;
    constructor(catalogueRepository: Repository<CatalogueFormation>, stagiaireRepository: Repository<Stagiaire>);
    findAll(): Promise<CatalogueFormation[]>;
    findOne(id: number): Promise<CatalogueFormation>;
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
                id: any;
                titre: any;
                description: any;
                categorie: any;
                duree: any;
                image_url: any;
                statut: any;
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
