import { Repository } from "typeorm";
import { Formation } from "../entities/formation.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminFormationController {
    private formationRepository;
    private apiResponse;
    constructor(formationRepository: Repository<Formation>, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Formation>>;
    findOne(id: number): Promise<any>;
    create(data: any): Promise<any>;
    update(id: number, data: any): Promise<any>;
    remove(id: number): Promise<any>;
    duplicate(id: number): Promise<any>;
}
