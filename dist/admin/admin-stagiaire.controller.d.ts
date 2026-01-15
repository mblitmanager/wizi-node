import { Repository, DataSource } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { User } from "../entities/user.entity";
import { StagiaireCatalogueFormation } from "../entities/stagiaire-catalogue-formation.entity";
import { Commercial } from "../entities/commercial.entity";
import { PoleRelationClient } from "../entities/pole-relation-client.entity";
import { Partenaire } from "../entities/partenaire.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminStagiaireController {
    private stagiaireRepository;
    private userRepository;
    private stagiaireCatalogueFormationRepository;
    private commercialRepository;
    private poleRelationClientRepository;
    private partenaireRepository;
    private dataSource;
    private apiResponse;
    constructor(stagiaireRepository: Repository<Stagiaire>, userRepository: Repository<User>, stagiaireCatalogueFormationRepository: Repository<StagiaireCatalogueFormation>, commercialRepository: Repository<Commercial>, poleRelationClientRepository: Repository<PoleRelationClient>, partenaireRepository: Repository<Partenaire>, dataSource: DataSource, apiResponse: ApiResponseService);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<Stagiaire>>;
    findOne(id: number): Promise<any>;
    create(body: any): Promise<any>;
    update(id: number, body: any): Promise<any>;
    remove(id: number): Promise<any>;
    active(id: number): Promise<any>;
    desactive(id: number): Promise<any>;
}
