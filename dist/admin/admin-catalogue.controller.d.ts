import { Repository } from "typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminCatalogueController {
    private catalogueRepository;
    private apiResponse;
    constructor(catalogueRepository: Repository<CatalogueFormation>, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<CatalogueFormation>>;
    findOne(id: number): Promise<any>;
    create(body: any): Promise<any>;
    update(id: number, body: any): Promise<any>;
    delete(id: number): Promise<any>;
    duplicate(id: number): Promise<any>;
    downloadPdf(id: number): Promise<any>;
}
