import { ApiResponseService } from "../common/services/api-response.service";
import { Repository } from "typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Formateur } from "../entities/formateur.entity";
export declare class FormateurFormationController {
    private catalogueFormationRepository;
    private stagiaireRepository;
    private formateurRepository;
    private apiResponse;
    constructor(catalogueFormationRepository: Repository<CatalogueFormation>, stagiaireRepository: Repository<Stagiaire>, formateurRepository: Repository<Formateur>, apiResponse: ApiResponseService);
    getAvailable(req: any): Promise<any>;
    getStagiairesByFormation(formationId: number, req: any): Promise<any>;
    assignStagiaires(formationId: number, body: any, req: any): Promise<any>;
    getUnassignedStagiaires(formationId: number, req: any): Promise<any>;
    updateSchedule(formationId: number, body: any, req: any): Promise<any>;
    getFormationStats(formationId: number, req: any): Promise<any>;
}
