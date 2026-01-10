import { Repository } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminStagiaireController {
    private stagiaireRepository;
    private apiResponse;
    constructor(stagiaireRepository: Repository<Stagiaire>, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Stagiaire>>;
    findOne(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Stagiaire>>;
    create(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Stagiaire[]>>;
    update(id: number, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Stagiaire>>;
    remove(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
}
