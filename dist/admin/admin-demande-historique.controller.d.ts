import { Repository } from "typeorm";
import { DemandeInscription } from "../entities/demande-inscription.entity";
import { ApiResponseService } from "../common/services/api-response.service";
import { Response } from "express";
export declare class AdminDemandeHistoriqueController {
    private demandeRepository;
    private apiResponse;
    constructor(demandeRepository: Repository<DemandeInscription>, apiResponse: ApiResponseService);
    index(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<DemandeInscription>>;
    show(id: number): Promise<any>;
    exportCsv(res: Response): Promise<Response<any, Record<string, any>>>;
    exportXlsx(res: Response): Promise<Response<any, Record<string, any>>>;
}
