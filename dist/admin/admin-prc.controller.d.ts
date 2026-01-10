import { Repository } from "typeorm";
import { PoleRelationClient } from "../entities/pole-relation-client.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminPoleRelationClientController {
    private prcRepository;
    private apiResponse;
    constructor(prcRepository: Repository<PoleRelationClient>, apiResponse: ApiResponseService);
    index(page?: number, limit?: number, search?: string): Promise<{
        data: PoleRelationClient[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    create(): Promise<{
        message: string;
    }>;
    store(data: any): Promise<PoleRelationClient[]>;
    show(id: number): Promise<PoleRelationClient>;
    edit(id: number): Promise<{
        form: PoleRelationClient;
    }>;
    update(id: number, data: any): Promise<PoleRelationClient>;
    destroy(id: number): Promise<import("typeorm").DeleteResult>;
}
