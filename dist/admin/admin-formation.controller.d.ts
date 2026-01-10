import { Repository } from "typeorm";
import { Formation } from "../entities/formation.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminFormationController {
    private formationRepository;
    private apiResponse;
    constructor(formationRepository: Repository<Formation>, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Formation>>;
    findOne(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Formation>>;
    create(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Formation[]>>;
    update(id: number, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Formation>>;
    remove(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
    duplicate(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Formation>>;
}
