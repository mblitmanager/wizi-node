import { Repository } from "typeorm";
import { Commercial } from "../entities/commercial.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class CommercialController {
    private commercialRepository;
    private apiResponse;
    constructor(commercialRepository: Repository<Commercial>, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Commercial>>;
    findOne(id: number): Promise<any>;
    create(data: any): Promise<any>;
    update(id: number, data: any): Promise<any>;
    remove(id: number): Promise<any>;
}
