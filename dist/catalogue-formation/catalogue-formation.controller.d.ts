import { CatalogueFormationService } from "./catalogue-formation.service";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class CatalogueFormationController {
    private readonly catalogueService;
    private readonly apiResponse;
    constructor(catalogueService: CatalogueFormationService, apiResponse: ApiResponseService);
    getAll(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
    getAllFormations(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
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
    getMyStagiaireCatalogues(req: any): Promise<any>;
    getStagiaireCatalogues(id: number): Promise<any>;
    getOne(id: number): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation>;
    getAllForParrainage(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
}
export declare class FormationParrainageController {
    private readonly catalogueService;
    constructor(catalogueService: CatalogueFormationService);
    formations(): Promise<import("../entities/catalogue-formation.entity").CatalogueFormation[]>;
}
