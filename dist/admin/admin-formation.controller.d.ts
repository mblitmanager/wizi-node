import { Repository } from "typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
export declare class AdminFormationController {
    private formationRepository;
    constructor(formationRepository: Repository<CatalogueFormation>);
    findAll(page?: number, limit?: number): Promise<{
        data: CatalogueFormation[];
        meta: {
            total: number;
            page: number;
            last_page: number;
        };
    }>;
    findOne(id: number): Promise<CatalogueFormation>;
    create(data: any): Promise<CatalogueFormation[]>;
    update(id: number, data: any): Promise<CatalogueFormation>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
