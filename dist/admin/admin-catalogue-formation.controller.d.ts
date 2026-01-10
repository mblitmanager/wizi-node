import { Repository } from "typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminCatalogueFormationController {
    private catalogueRepository;
    private apiResponse;
    constructor(catalogueRepository: Repository<CatalogueFormation>, apiResponse: ApiResponseService);
    index(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<CatalogueFormation>>;
    create(): Promise<{
        message: string;
    }>;
    store(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<CatalogueFormation[]>>;
    show(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<CatalogueFormation>>;
    edit(id: number): Promise<{
        form: CatalogueFormation;
    }>;
    update(id: number, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<CatalogueFormation>>;
    destroy(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    duplicate(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<CatalogueFormation>>;
    downloadPdf(id: number): Promise<{
        message: string;
        catalogueId: number;
    }>;
}
