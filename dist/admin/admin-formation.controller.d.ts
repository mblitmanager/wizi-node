import { Repository } from "typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
export declare class AdminFormationController {
    private formationRepository;
    constructor(formationRepository: Repository<CatalogueFormation>);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: CatalogueFormation[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    findOne(id: number): Promise<CatalogueFormation>;
    create(data: any): Promise<CatalogueFormation[]>;
    update(id: number, data: any): Promise<CatalogueFormation>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
