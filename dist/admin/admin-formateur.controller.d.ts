import { Repository } from "typeorm";
import { Formateur } from "../entities/formateur.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminFormateurController {
    private formateurRepository;
    private apiResponse;
    constructor(formateurRepository: Repository<Formateur>, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Formateur>>;
    findOne(id: number): Promise<any>;
    create(data: any): Promise<any>;
    update(id: number, data: any): Promise<any>;
    remove(id: number): Promise<any>;
}
