import { Repository } from "typeorm";
import { Commercial } from "../entities/commercial.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminCommercialController {
    private commercialRepository;
    private apiResponse;
    constructor(commercialRepository: Repository<Commercial>, apiResponse: ApiResponseService);
    index(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Commercial>>;
    store(data: any): Promise<any>;
    show(id: number): Promise<any>;
    update(id: number, data: any): Promise<any>;
    patch(id: number, data: any): Promise<any>;
    destroy(id: number): Promise<any>;
}
