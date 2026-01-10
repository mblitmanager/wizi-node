import { Repository } from "typeorm";
import { Commercial } from "../entities/commercial.entity";
export declare class AdminCommercialController {
    private commercialRepository;
    constructor(commercialRepository: Repository<Commercial>);
    index(page?: number, limit?: number, search?: string): Promise<{
        data: Commercial[];
        pagination: {
            total: number;
            page: number;
            total_pages: number;
        };
    }>;
    create(): Promise<{
        message: string;
    }>;
    store(data: any): Promise<Commercial[]>;
    show(id: number): Promise<Commercial>;
    edit(id: number): Promise<{
        form: Commercial;
    }>;
    update(id: number, data: any): Promise<Commercial>;
    patch(id: number, data: any): Promise<Commercial>;
    destroy(id: number): Promise<import("typeorm").DeleteResult>;
}
