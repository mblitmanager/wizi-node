import { Repository } from "typeorm";
import { PoleRelationClient } from "../entities/pole-relation-client.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminPoleRelationClientController {
    private prcRepository;
    private apiResponse;
    constructor(prcRepository: Repository<PoleRelationClient>, apiResponse: ApiResponseService);
    index(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<PoleRelationClient>>;
    store(data: any): Promise<any>;
    show(id: number): Promise<any>;
    update(id: number, data: any): Promise<any>;
    destroy(id: number): Promise<any>;
}
