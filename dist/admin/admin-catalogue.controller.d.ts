import { Repository } from "typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
export declare class AdminCatalogueController {
    private catalogueRepository;
    constructor(catalogueRepository: Repository<CatalogueFormation>);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: CatalogueFormation[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    findOne(id: number): Promise<CatalogueFormation>;
    create(body: any): Promise<CatalogueFormation[]>;
    update(id: number, body: any): Promise<CatalogueFormation>;
    delete(id: number): Promise<{
        success: boolean;
    }>;
    duplicate(id: number): Promise<CatalogueFormation>;
    downloadPdf(id: number): Promise<{
        filename: string;
        content: string;
    }>;
}
