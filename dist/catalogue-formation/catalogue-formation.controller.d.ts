import { CatalogueFormationService } from "./catalogue-formation.service";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class CatalogueFormationController {
    private readonly catalogueService;
    private readonly apiResponse;
    constructor(catalogueService: CatalogueFormationService, apiResponse: ApiResponseService);
    getAllForParrainage(): Promise<any>;
    getAll(): Promise<any>;
    getAllFormations(): Promise<any>;
    getOne(id: number): Promise<any>;
    getMyStagiaireCatalogues(req: any): Promise<any>;
    getStagiaireCatalogues(id: number): Promise<any>;
}
