import { Repository } from "typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
export declare class CatalogueFormationService {
    private readonly catalogueRepository;
    constructor(catalogueRepository: Repository<CatalogueFormation>);
    findAll(): Promise<CatalogueFormation[]>;
    findOne(id: number): Promise<CatalogueFormation>;
}
