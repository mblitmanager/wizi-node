import { Repository } from "typeorm";
import { CatalogueFormation } from "../entities/catalogue-formation.entity";
export declare class AdminCatalogueFormationController {
    private catalogueRepository;
    constructor(catalogueRepository: Repository<CatalogueFormation>);
    index(page?: number, limit?: number, search?: string): Promise<{
        data: CatalogueFormation[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    create(): Promise<{
        message: string;
    }>;
    store(data: any): Promise<CatalogueFormation[]>;
    show(id: number): Promise<CatalogueFormation>;
    edit(id: number): Promise<{
        form: CatalogueFormation;
    }>;
    update(id: number, data: any): Promise<CatalogueFormation>;
    destroy(id: number): Promise<import("typeorm").DeleteResult>;
    duplicate(id: number): Promise<CatalogueFormation>;
    downloadPdf(id: number): Promise<{
        message: string;
        catalogueId: number;
    }>;
}
