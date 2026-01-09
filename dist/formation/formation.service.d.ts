import { Repository } from "typeorm";
import { Formation } from "../entities/formation.entity";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
export declare class FormationService {
    private formationRepository;
    private catalogueRepository;
    constructor(formationRepository: Repository<Formation>, catalogueRepository: Repository<CatalogueFormation>);
    getAllFormations(): Promise<Formation[]>;
    getAllCatalogueFormations(): Promise<CatalogueFormation[]>;
    getCatalogueWithFormations(): Promise<CatalogueFormation[]>;
}
