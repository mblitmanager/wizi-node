import { Repository } from "typeorm";
import { Formateur } from "../entities/formateur.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminFormateurController {
    private formateurRepository;
    private apiResponse;
    constructor(formateurRepository: Repository<Formateur>, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Formateur>>;
    findOne(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Formateur>>;
    create(data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Formateur[]>>;
    update(id: number, data: any): Promise<import("../common/interfaces/api-response.interface").ApiResponse<Formateur>>;
    remove(id: number): Promise<import("../common/interfaces/api-response.interface").ApiResponse<unknown>>;
}
