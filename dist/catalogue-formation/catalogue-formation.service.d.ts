import { Repository } from "typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
export declare class CatalogueFormationService {
    private readonly catalogueRepository;
    private readonly stagiaireRepository;
    constructor(catalogueRepository: Repository<CatalogueFormation>, stagiaireRepository: Repository<Stagiaire>);
    findAll(): Promise<CatalogueFormation[]>;
    findOne(id: number): Promise<CatalogueFormation>;
    getFormationsAndCatalogues(stagiaireId: number): Promise<any>;
}
