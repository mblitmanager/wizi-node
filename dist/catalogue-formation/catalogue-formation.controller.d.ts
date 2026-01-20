import { CatalogueFormationService } from "./catalogue-formation.service";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class CatalogueFormationController {
    private readonly catalogueService;
    private readonly apiResponse;
    constructor(catalogueService: CatalogueFormationService, apiResponse: ApiResponseService);
    getAll(): Promise<any[]>;
    getAllFormations(): Promise<any[]>;
    getWithFormations(req: any): Promise<{
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
    getMyStagiaireCatalogues(req: any): Promise<any>;
    getStagiaireCatalogues(id: number): Promise<any>;
    getOne(id: number, req: any): Promise<any>;
    getAllForParrainage(): Promise<any[]>;
}
export declare class FormationParrainageController {
    private readonly catalogueService;
    constructor(catalogueService: CatalogueFormationService);
    formations(): Promise<any[]>;
}
