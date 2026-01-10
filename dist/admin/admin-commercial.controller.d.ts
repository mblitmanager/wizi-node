import { Repository } from "typeorm";
import { Commercial } from "../entities/commercial.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminCommercialController {
    private commercialRepository;
    private apiResponse;
    constructor(commercialRepository: Repository<Commercial>, apiResponse: ApiResponseService);
    index(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Commercial>>;
    store(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Commercial[]>>;
    show(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Commercial>>;
    update(id: number, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Commercial>>;
    patch(id: number, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Commercial>>;
    destroy(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
}
